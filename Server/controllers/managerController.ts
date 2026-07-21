import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
import { deleteStudentProfileService, deleteAdmissionByRollNumberService } from "../services/deletionServices";

export async function deleteStudentProfileController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { rollNumber }  = req.params as {rollNumber : string};

    if (!rollNumber) {
      throw AppError("Roll number is required", httpStatus.BAD_REQUEST);
    }

    await deleteStudentProfileService(rollNumber);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Student profile deleted successfully",
    });
  } catch (err) {
    throw AppError(
        "Failed to delete student profile",
        httpStatus.INTERNAL_SERVER_ERROR
    );
  }
}


export async function deleteStudentAdmissionController(
  req: AuthRequest,
  res: Response
) {
  try {
    const { rollNumber }  = req.params as {rollNumber : string};

    if (!rollNumber) {
      throw AppError("Roll number is required", httpStatus.BAD_REQUEST);
    }

    await deleteAdmissionByRollNumberService(rollNumber);

    res.status(httpStatus.OK).json({
      success: true,
      message: "Student Admission deleted successfully",
    });
  } catch (err) {
    throw AppError(
        "Failed to delete student profile",
        httpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
