import { Request, Response,NextFunction } from "express";
import { ZodError } from "zod";
import dayjs from "dayjs";
import httpStatus from "http-status";
import { getRollNoFromUserId } from "../services/helper";
import { AppError } from "../utils/AppError";
import { studentSchema } from "../validation/student.schema";
import { handleFileUpload } from "../services/cloudflare/fileUpload";
import {
  findStudentByRollNo,
  insertStudentDetails,
  updateStudentByRollNo,
} from "../services/detailsService";
import { AuthRequest } from "../types/roles";

type FileMap = Record<string, Express.Multer.File[]>;

const requiredFiles = [
  "passportPhotoUrl",
  "studentSignatureUrl",
  "parentGuardianSignatureUrl",
  "categoryProofUrl",
  "aadhaarUrl",
  "admissionSlipUrl",
];

const fileFieldToFolder: Record<
  string,
  { folder: string; signature: string }
> = {
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

export async function getStudentDetailsController(req: AuthRequest, res: Response) {
  const { rollNo } = req.params;

  if (!rollNo) {
    throw AppError("Roll number is required", httpStatus.BAD_REQUEST);
  }

  const student = await findStudentByRollNo(rollNo);

  if (!student.length) {
    res.status(httpStatus.OK).json({
      success: false,
      data: {},
      message: "Student not found",
    });
    return;
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: student[0],
    message: "Student details fetched successfully",
  });
}

export async function getStudentDetailsUsingUserIdController(req: AuthRequest, res: Response) {

  if (!req.User || !req.User.id) {
    throw AppError("User not authenticated or user ID is missing", httpStatus.UNAUTHORIZED);
  }
  const userId = req.User.id;
  if (!userId) {
    throw AppError("User ID is required", httpStatus.BAD_REQUEST);
  }
  const rollNo = await getRollNoFromUserId(Number(userId));
  if (!rollNo) {
    res.status(httpStatus.OK).json({
      success: false,
      data: {},
      message: "Roll number not found for the user",
    });
    return;
  }
  const student = await findStudentByRollNo(rollNo);
  if (!student.length) {
    res.status(httpStatus.OK).json({
      success: false,
      data: {},
      message: "Student not found",
    });
    return;
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: student[0],
    message: "Student details fetched successfully",
  });
}

export async function createStudentDetailsController(req: AuthRequest, res: Response) {
  const { body, files } = req;

  const missingFile = requiredFiles.find(
    (field) => !(files as FileMap)?.[field]?.length
  );
  if (missingFile) {
    throw AppError(
      `Missing required file: ${missingFile}`,
      httpStatus.BAD_REQUEST
    );
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

  const student = await insertStudentDetails(dbReadyData);

  res.status(httpStatus.CREATED).json({
    success: true,
    data: student,
    message: "Student details created successfully",
  });
}

export async function updateStudentDetailsController(req: AuthRequest, res: Response) {
  const { rollNo } = req.params;
  const { body, files } = req;
  const existingStudent = await findStudentByRollNo(rollNo);
  if (!existingStudent.length) {
    throw AppError("Student with provided roll number not found", httpStatus.NOT_FOUND);
  }
  console.log(existingStudent);
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

  const imageFields = Object.keys(fileFieldToFolder);

  for (const field of imageFields) {
    const fileArr = (files as FileMap)?.[field];
    if (fileArr?.length > 0) {
      const file = fileArr[0];
      const { folder, signature } = fileFieldToFolder[field];
      const userId = validated.user_id ?? "unknown";
      const url = await handleFileUpload(file, String(userId), folder, signature);
      updatedData[field] = url;
    }
  }

  const result = await updateStudentByRollNo(rollNo, updatedData);

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: "Student details updated successfully",
  });
}
