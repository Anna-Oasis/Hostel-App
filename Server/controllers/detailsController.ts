import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import dayjs from "dayjs";
import { studentSchema } from "../validation/student.schema";
import { handleFileUpload } from "../services/cloudflare/fileUpload";
import { findStudentByRollNo,insertStudentDetails,updateStudentByRollNo } from "../services/detailsService";
import { studentModel } from "../models/studentModel";

type FileMap = Record<string, Express.Multer.File[]>;

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

    const student = await findStudentByRollNo(rollNo);
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

  const requiredFiles = [
    "passportPhotoUrl",
    "studentSignatureUrl",
    "parentGuardianSignatureUrl",
    "categoryProofUrl",
    "aadhaarUrl",
    "admissionSlipUrl",
  ];

  const fileFieldToFolder: Record<string, { folder: string; signature: string }> = {
    passportPhotoUrl: { folder: "passport", signature: "passport" },
    studentSignatureUrl: { folder: "signature", signature: "signature" },
    parentGuardianSignatureUrl: {
      folder: "parentGuardianSignature",
      signature: "parentGuardianSignature",
    },
    categoryProofUrl: { folder: "categoryProof", signature: "categoryProof" },
    aadhaarUrl: { folder: "aadhaar", signature: "aadhaar" },
    admissionSlipUrl: { folder: "admissionSlip", signature: "admissionSlip" },
  };

  try {
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
    const dbReadyData = {
      ...validatedData,
      dateOfBirth: dayjs(validatedData.dateOfBirth).format("YYYY-MM-DD"),
      createdAt: dayjs(validatedData.createdAt).format("YYYY-MM-DD"),
    };

    const userId = dbReadyData.user_id;
    const uploadedUrls: Record<string, string> = {};

    await Promise.all(
      requiredFiles.map(async (field) => {
        const fileArr = (files as FileMap)[field];
        const { folder, signature } = fileFieldToFolder[field];
        uploadedUrls[field] = await handleFileUpload(
          fileArr[0],
          String(userId),
          folder,
          signature
        );
      })
    );

    Object.assign(dbReadyData, uploadedUrls);

    await insertStudentDetails(dbReadyData);

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
    console.error("❌ Error while creating student:", error);
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
  const { rollNo } = req.params;
  const { body, files } = req;

  const imageFields = [
    "passportPhotoUrl",
    "studentSignatureUrl",
    "parentGuardianSignatureUrl",
    "categoryProofUrl",
    "aadhaarUrl",
    "admissionSlipUrl",
  ];

  const fieldToColumnMap: Record<string, keyof typeof studentModel._.columns> = {
    passportPhotoUrl: "passportPhotoUrl",
    studentSignatureUrl: "studentSignatureUrl",
    parentGuardianSignatureUrl: "parentGuardianSignatureUrl",
    categoryProofUrl: "categoryProofUrl",
    aadhaarUrl: "aadhaarUrl",
    admissionSlipUrl: "admissionSlipUrl",
  };

  const fieldToFolderMap: Record<string, string> = {
    passportPhotoUrl: "passport",
    studentSignatureUrl: "signature",
    parentGuardianSignatureUrl: "parentGuardianSignature",
    categoryProofUrl: "categoryProof",
    aadhaarUrl: "aadhaar",
    admissionSlipUrl: "admissionSlip",
  };

  try {
    const validated = studentSchema.partial().parse(body);
    const updatedData: Record<string, any> = {
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
      if (fileArr?.length > 0) {
        const file = fileArr[0];
        const folder = fieldToFolderMap[field];
        const signatureKey = fieldToColumnMap[field];
        const userId = validated.user_id ?? "unknown";

        const url = await handleFileUpload(file, String(userId), folder, signatureKey);
        updatedData[signatureKey] = url;
      }
    }

    const result = await updateStudentByRollNo(rollNo, updatedData);

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
