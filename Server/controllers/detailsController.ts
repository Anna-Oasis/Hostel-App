import { Response } from "express";
import dayjs from "dayjs";
import httpStatus from "http-status";
import { AppError } from "../utils/AppError";
import { studentDetailsDecisionSchema, studentSchema } from "../validation/details.schema";
import { handleFileUpload } from "../services/cloudflare/fileUpload";
import {
  fetchStudentDetailsForRC,
  fetchStudentsForManagerVerification,
  findStudentByRollNo,
  findStudentByUserId,
  insertStudentDetails,
  updateStudentByRollNo,
} from "../services/detailsService";
import { AuthRequest } from "../types/roles";
import { getRCByUserId } from "../services/rcServices";

type FileMap = Record<string, Express.Multer.File[]>;

const requiredFiles = [
  "passportPhotoUrl",
  "studentSignatureUrl",
  "parentGuardianSignatureUrl",
  "categoryProofUrl",
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
  admissionSlipUrl: { folder: "admissionSlip", signature: "admissionSlip" },
};

export async function getStudentDetailsUsingRollNoController(req: AuthRequest, res: Response) {
  const { rollNo } = req.params;

  if (!rollNo) {
    throw AppError("Roll number is required", httpStatus.BAD_REQUEST);
  }

  const data = await findStudentByRollNo(rollNo);

 res.status(httpStatus.OK).json({
      success: true,
      data: data[0]||[],
      count:data?data.length:0,
      message: data && data.length >0
      ? "Student details fetched successfully"
      : "Student not found",
    });
}

export async function getStudentDetailsUsingUserIdController(req: AuthRequest, res: Response) {
  if (!req.User) {
    throw AppError("User not authenticated or user ID is missing", httpStatus.UNAUTHORIZED);
  }

  const student = await findStudentByUserId(Number(req.User.id));

  res.status(httpStatus.OK).json({
      success: true,
      data: student[0]||[],
      count:student?student.length:0,
      message: student && student.length >0
      ? "Student details fetched successfully"
      : "Student not found",
    });
}

export async function createStudentDetailsController(req: AuthRequest, res: Response) {
    if (!req.User) {
      throw AppError(
        "User information is missing from request",
        httpStatus.UNAUTHORIZED
      );
    }

    const validation = studentSchema.safeParse(req.body);
    if (!validation.success) {
      console.error("Validation failed:", validation.error.format());
      throw AppError("Validation error", httpStatus.BAD_REQUEST);
    }
    const validated = validation.data;


    const Data = {
      ...validated,
      dateOfBirth: dayjs(validated.dateOfBirth).format("YYYY-MM-DD"),
      createdAt: dayjs(validated.createdAt).format("YYYY-MM-DD"),
      user_id: req.User.id,
    };

    const result = await insertStudentDetails(Data);

    if(!result){
      throw AppError(
        "Failed to insert student detials",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    res.status(httpStatus.CREATED).json({
      success: true,
      data: result,
      count:result.length,
      message: "Student details inserted successfully",
    });
};


/*export async function createStudentDetailsController(req: AuthRequest, res: Response) {
  if (!req.User) {
    throw AppError("User information is missing from request", httpStatus.UNAUTHORIZED);
  }

  const { body, files } = req;
  const validatedData = studentSchema.parse(body);
  const dbReadyData = {
    ...validatedData,
    dateOfBirth: dayjs(validatedData.dateOfBirth).format("YYYY-MM-DD"),
    createdAt: dayjs(validatedData.createdAt).format("YYYY-MM-DD"),
    userId: req.User.id
  };

  const missingFile = requiredFiles.find((field) => !(files as FileMap)?.[field]?.length);
  if (missingFile) {
    throw AppError(`Missing required file: ${missingFile}`, httpStatus.BAD_REQUEST);
  }

  

  const uploadedUrls: Record<string, string> = {};
  const userId = req.User.id;

  await Promise.all(
    requiredFiles.map(async (field) => {
      const fileArr = (files as FileMap)[field];
      const { folder, signature } = fileFieldToFolder[field];
      uploadedUrls[field] = await handleFileUpload(fileArr[0], String(userId), folder, signature);
    })
  );

  Object.assign(dbReadyData, uploadedUrls);

  const result = await insertStudentDetails(dbReadyData);

  if (!result) {
    throw AppError("Failed to insert student details", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.CREATED).json({
    success: true,
    data: result,
    message: "Student details created successfully",
  });
}*/


export async function updateStudentDetailsController(req: AuthRequest, res: Response) {
  if (!req.User) {
    throw AppError("User information is missing from request", httpStatus.UNAUTHORIZED);
  }

  const rollNo = req.params.roll_number;
  const { body, files } = req;

  if (!rollNo) {
    throw AppError("Roll number is required", httpStatus.BAD_REQUEST);
  }

  const existingStudent = await findStudentByRollNo(rollNo);
  if (!existingStudent.length) {
    throw AppError("Student with provided roll number not found", httpStatus.NOT_FOUND);
  }

  const validated = studentSchema.partial().parse(body);
  const updatedData: Record<string, any> = {
    ...validated,
    dateOfBirth: validated.dateOfBirth
      ? dayjs(validated.dateOfBirth).format("YYYY-MM-DD")
      : undefined,
    createdAt: validated.createdAt
      ? dayjs(validated.createdAt).format("YYYY-MM-DD")
      : undefined,
    userId: req.User.id
  };

  const imageFields = Object.keys(fileFieldToFolder);
  for (const field of imageFields) {
    const fileArr = (files as FileMap)?.[field];
    if (fileArr?.length > 0) {
      const file = fileArr[0];
      const { folder, signature } = fileFieldToFolder[field];
      const userId = req.User.id;
      const url = await handleFileUpload(file, String(userId), folder, signature);
      updatedData[field] = url;
    }
  }

  const result = await updateStudentByRollNo(rollNo, updatedData);

  if (!result) {
    throw AppError("Student details update failed", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: "Student details updated successfully",
  });
}

export const fetchStudentDetailsForManagerVerificationController = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.User) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }
  
  const result = await fetchStudentsForManagerVerification();
  console.log("Fetched Students:", result);

  res.status(httpStatus.OK).json({
    success: true,
    data: result || [],
    count: result ? result.length : 0,
    message: result && result.length > 0 
    ? "Fetched student details successfully"
    :  "No student records found",
  });
};

export async function approveStudentDetailsByManagerController(
  req: AuthRequest,
  res: Response
) 
{
  if (!req.User) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }
  
  const rollNo = req.params.rollNo;

  const validatedData = studentDetailsDecisionSchema.parse(req.body);

  if (!rollNo) {
    throw AppError(
      "Roll number is required",
      httpStatus.BAD_REQUEST
    );
  }

  // If approve is false, comment is required
  if (validatedData.approve === false && (!validatedData.comment || validatedData.comment.trim() === "")) {
    throw AppError(
      "Comment is required when declining",
      httpStatus.BAD_REQUEST
    );
  }

  const student = await findStudentByRollNo(rollNo);

  if (student.length === 0) {
    throw AppError(
      "Student not found for the provided roll number",
      httpStatus.NOT_FOUND
    );
  }

  const updatedStudent = await updateStudentByRollNo(rollNo, validatedData);

  if(!updatedStudent){
    throw AppError(
      "Student details approval is not updated",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
  
  res.status(httpStatus.OK).json({
    success: true,
    data: {
      student: updatedStudent,
    },
    message: "Student details approval updated successfully",
  });
}

export const fetchStudentDetailsForRcController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
    if (!req.User) {
        throw AppError(
        "User information is missing from request",
        httpStatus.UNAUTHORIZED
        );
    }
    const rc = await getRCByUserId(Number(req.User.id));
    console.log("RC Details:", rc);

    if (!rc || rc.length === 0) {
      throw AppError("RC not found", httpStatus.NOT_FOUND);
    }

    if (rc[0].hostel == null || rc[0].floor == null) {
      throw AppError("RC hostel or floor information is missing", httpStatus.INTERNAL_SERVER_ERROR);
    }

    const result = await fetchStudentDetailsForRC(rc[0].floor, rc[0].hostel);
    console.log(result)

    res.status(httpStatus.OK).json({
        success: true,
        data: result || [],
        count: result ? result.length : 0,
        message: result && result.length > 0 
        ? "Fetched student details successfully"
        :  "No student records found",
    });
};