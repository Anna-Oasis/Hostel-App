import { Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../utils/AppError";
import { createAttendanceSchema } from "../validation/attendance.schema";
import { 
  createAttendanceByRc, 
  getAttendanceByRc, 
  fetchAllAttendance 
} from "../services/attendanceService";
import { AuthRequest } from "../types/roles";

export async function createAttendanceByRcController(req: AuthRequest, res: Response) {

  const validatedData = createAttendanceSchema.parse(req.body);
  
  const rc_id = Number(req.params.rc_id);

  const result = await createAttendanceByRc({
    ...validatedData,
    rc_id: rc_id,
    created_at: new Date(),
    updated_at: new Date(),
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    data: result[0],
    message: result.length > 1 ? "Attendance updated successfully" : "Attendance created successfully",
  });
}

export async function getAttendanceByRcController(req: AuthRequest, res: Response) {
  const rc_id = Number(req.params.rc_id);

  if (!rc_id) {
    throw AppError("RC ID is required", httpStatus.BAD_REQUEST);
  }

  const attendanceRecords = await getAttendanceByRc(rc_id);

  if (attendanceRecords.length === 0) {
    throw AppError("No attendance records found for this RC", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: attendanceRecords,
    count: attendanceRecords.length,
    message: "Attendance records retrieved successfully",
  });
}

export async function getAllAttendanceController(req: AuthRequest, res: Response) {
  const attendanceRecords = await fetchAllAttendance();

  if (attendanceRecords.length === 0) {
    throw AppError("No attendance records found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: attendanceRecords,
    count: attendanceRecords.length,
    message: "All attendance records retrieved successfully",
  });
}