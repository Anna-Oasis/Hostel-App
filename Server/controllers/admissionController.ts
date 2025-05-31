import { Request, Response, NextFunction } from "express";
import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionSchema } from "../validation/admission.schema";
import fs from "fs";
import { uploadFile, getPublicUrl } from "../services/supabase/fileHandling";
import { ZodError } from "zod";
import dayjs from "dayjs";

type FileMap = Record<string, Express.Multer.File[]>;

const handleFileUpload = async (
  file: Express.Multer.File,
  userId: string,
  folder: string,
  signature: string
): Promise<string> => {
  const ext = file.originalname
    ? file.originalname.substring(file.originalname.lastIndexOf("."))
    : "";
  const timestampMatch = file.filename.match(/-(\d+)\./);
  const timestamp = timestampMatch ? timestampMatch[1] : Date.now();
  const newFileName = `${userId}-${signature}-${timestamp}${ext}`;
  console.log(`Uploading as: ${newFileName} to folder: ${folder}`);

  const fileBuffer = fs.readFileSync(file.path);
  const { error } = await uploadFile(fileBuffer, newFileName, folder);
  fs.unlinkSync(file.path);

  if (error) {
    throw new Error(`Failed to upload ${signature}: ${error.message}`);
  }

  const publicUrl = getPublicUrl(newFileName, folder);
  console.log(`Uploaded ${signature} to Supabase:`, publicUrl);
  return publicUrl;
};

export const submitAdmission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body, files } = req;
    console.log("Request Body:", body);
    console.log("Request Files:", files);

    const validatedData = admissionSchema.parse(body);
    console.log("Validated Data:", validatedData);

    const dbReadyData = {
      ...validatedData,
      dateOfBirth: dayjs(validatedData.dateOfBirth).format("YYYY-MM-DD"),
      createdAt: dayjs(validatedData.createdAt).format("YYYY-MM-DD"),
    };

    const userId = dbReadyData.user_id;

    const fileFieldToFolder: Record<string, { folder: string; signature: string }> = {
      "images[passportPhoto]": { folder: "passport", signature: "passport" },
      "images[studentSignature]": { folder: "signature", signature: "signature" },
      "images[parentGuardianSignature]": { folder: "parentSignature", signature: "parentGuardianSignature" },
    };

    const uploadedUrls: Record<string, string> = {};

    for (const field in fileFieldToFolder) {
      const fileArr = (files as FileMap)?.[field];
      if (fileArr?.[0]) {
        const { folder, signature } = fileFieldToFolder[field];
        uploadedUrls[field] = await handleFileUpload(fileArr[0], String(userId), folder, signature);
      } else {
        console.warn(`No file provided for ${field}`);
      }
    }

    // Add file URLs to DB data
    dbReadyData.passportPhotoUrl = uploadedUrls["images[passportPhoto]"];
    dbReadyData.studentSignatureUrl = uploadedUrls["images[studentSignature]"];
    dbReadyData.parentGuardianSignatureUrl = uploadedUrls["images[parentGuardianSignature]"];

    console.log("DB Ready Data:", dbReadyData);
    const result = await db.insert(admissionModel).values(dbReadyData);
    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Failed to insert admission record.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Admission submitted successfully",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Validation Error:", error.errors);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.errors,
      });
    }
    console.error("Server Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
