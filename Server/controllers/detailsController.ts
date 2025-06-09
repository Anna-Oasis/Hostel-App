import { Request, Response, NextFunction } from "express";
import { eq } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { studentModel } from "../models/studentModel";
import fs from "fs/promises";
import { studentSchema } from "../validation/student.schema";
import { uploadFile, getPublicUrl } from "../services/cloudflare/fileHandling";
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
  console.log(`📤 Uploading ${signature} as: ${newFileName} to ${folder}`);

  try {
    const fileBuffer = await fs.readFile(file.path);
    const { error } = await uploadFile(fileBuffer, newFileName, folder);

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const publicUrl = getPublicUrl(newFileName, folder);
    console.log(`✅ Uploaded ${signature} => ${publicUrl}`);
    return publicUrl;
  } finally {
    try {
      await fs.unlink(file.path);
      console.log(`🧹 Deleted temp file: ${file.path}`);
    } catch (err) {
      console.error(`❌ Failed to delete temp file: ${file.path}`, err);
    }
  }
};

export const getDetailsByRollNo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { rollNo } = req.params;
    if (!rollNo) {
      return res.status(400).json({ message: "Roll number is required" });
    }

    const student = await db
      .select()
      .from(studentModel)
      .where(eq(studentModel.rollNo, rollNo));

    if (student.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.status(200).json({ student: student[0] });
  } catch (error) {
    console.error("Error fetching student details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createStudentDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { body, files } = req;
  console.log("📥 Received files:", files);
  const requiredFiles = [
  "passportPhotoUrl",
  "studentSignatureUrl",
  "parentGuardianSignatureUrl",
  "passportUrl",
  "aadhaarUrl",
  "admissionSlipUrl",
];

  const fileFieldToFolder: Record<string, { folder: string; signature: string }> = {
    "passportPhotoUrl": { folder: "passport", signature: "passport" },
    "studentSignatureUrl": { folder: "signature", signature: "signature" },
    "parentGuardianSignatureUrl": {
      folder: "parentSignature",
      signature: "parentGuardianSignature",
    },
    "passportUrl": { folder: "passport", signature: "passport" },
    "aadhaarUrl": { folder: "aadhaar", signature: "aadhaar" },
    "admissionSlipUrl": { folder: "admissionSlip", signature: "admissionSlip" },
  };

  let uploadedUrls: Record<string, string> = {};
  let dbReadyData: any = {};
  let userId: string | number = "";

  try {
    console.log("📦 Received body:", body);

    const missingFile = requiredFiles.find(
      (field) => !(files as FileMap)?.[field]?.length
    );
    if (missingFile) {
      return res.status(400).json({
        success: false,
        message: `Missing required file: ${missingFile}`,
      });
    }

    const validatedData = studentSchema.parse(body);
    dbReadyData = {
      ...validatedData,
      dateOfBirth: dayjs(validatedData.dateOfBirth).format("YYYY-MM-DD"),
      createdAt: dayjs(validatedData.createdAt).format("YYYY-MM-DD"),
    };

    userId = dbReadyData.user_id;

    uploadedUrls = {};
    await Promise.all(
      requiredFiles.map(async (field) => {
        const fileArr = (files as FileMap)[field];
        if (!fileArr || !fileArr[0]) {
          throw new Error(`Missing file array for field: ${field}`);
        }

        const { folder, signature } = fileFieldToFolder[field];
        uploadedUrls[field] = await handleFileUpload(
          fileArr[0],
          String(userId),
          folder,
          signature
        );
        console.log(`✅ Uploaded ${field}`);
      })
    );

    dbReadyData.passportPhotoUrl = uploadedUrls["passportPhotoUrl"];
    dbReadyData.studentSignatureUrl = uploadedUrls["studentSignatureUrl"];
    dbReadyData.parentGuardianSignatureUrl =
      uploadedUrls["parentGuardianSignatureUrl"];
    dbReadyData.passportUrl = uploadedUrls["passportUrl"];
    dbReadyData.aadhaarUrl = uploadedUrls["aadhaarUrl"];
    dbReadyData.admissionSlipUrl = uploadedUrls["admissionSlipUrl"];

    console.log("🗃️ DB Insert Payload:", dbReadyData);

    const result = await db.insert(studentModel).values(dbReadyData);
    console.log("✅ Inserted student:", result);

    return res.status(201).json({
      success: true,
      message: "Student details submitted successfully.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.errors,
      });
    }

    console.error("❌ Error while processing:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateStudentDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const rollNo = req.params.rollNo;
  const { body, files } = req;

  const imageFields = [
    "passportPhotoUrl",
    "studentSignatureUrl",
    "parentGuardianSignatureUrl",
    "passportUrl",
    "aadhaarUrl",
    "admissionSlipUrl",
  ];

  const fieldToColumnMap: Record<string, keyof typeof studentModel._.columns> = {
    "passportPhotoUrl": "passportPhotoUrl",
    "studentSignatureUrl": "studentSignatureUrl",
    "parentGuardianSignatureUrl": "parentGuardianSignatureUrl",
    "passportUrl": "passportUrl",
    "aadhaarUrl": "aadhaarUrl",
    "admissionSlipUrl": "admissionSlipUrl",

  };

  const fieldToFolderMap: Record<string, string> = {
    "passportPhotoUrl": "passport",
    "studentSignatureUrl": "signature",
    "parentGuardianSignatureUrl": "parentSignature",
    "passportUrl": "passport",
    "aadhaarUrl": "aadhaar",
    "admissionSlipUrl": "admissionSlip",
  };

  try {
    const validated = studentSchema.partial().parse(body);
    const updatedData = {
      ...validated,
      dateOfBirth: validated.dateOfBirth
        ? dayjs(validated.dateOfBirth).format("YYYY-MM-DD")
        : undefined,
      createdAt: validated.createdAt
        ? dayjs(validated.createdAt).format("YYYY-MM-DD")
        : undefined,
    };

    for (const field of imageFields) {
      const fileArr = (files as FileMap)?.[field];
      if (fileArr && fileArr.length > 0) {
        const file = fileArr[0];
        const folder = fieldToFolderMap[field];
        const signatureKey = fieldToColumnMap[field];
        const userId = validated.user_id ?? "unknown";

        const url = await handleFileUpload(file, String(userId), folder, signatureKey);
        (updatedData as any)[signatureKey] = url;
      }
    }

    const result = await db
      .update(studentModel)
      .set(updatedData)
      .where(eq(studentModel.rollNo, rollNo))
      .returning();

    return res.status(200).json({
      success: true,
      message: "Student details updated successfully.",
      data: result,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.errors,
      });
    }

    console.error("❌ Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
