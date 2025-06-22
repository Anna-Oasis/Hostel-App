import { Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../utils/AppError";
import { createAttendanceSchema } from "../validation/attendance.schema";
import { 
  createAttendanceByRc, 
  getAttendanceByRc, 
  fetchAllAttendance, 
  fetchAllAttendanceByDate
} from "../services/attendanceService";
import { AuthRequest } from "../types/roles";
import { getRCById } from "../services/rcServices";

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

  // First check the RC model to get RC details and alternate RC ID
  const rcDetailsArray = await getRCById(rc_id);
  const alternatingRCId = rcDetailsArray[0].alternatingToRCId;
  
  let attendanceRecords;
  let message;

  if (alternatingRCId) {
    const [currentRCAttendance, alternateRCAttendance] = await Promise.all([
      getAttendanceByRc(rc_id),
      getAttendanceByRc(alternatingRCId)
    ]);

    attendanceRecords = [...currentRCAttendance, ...alternateRCAttendance];
    
    attendanceRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    message = `Attendance records retrieved successfully for RC ${rc_id} and alternate RC ${alternatingRCId}`;
  } else {
    // Fetch attendance only for current RC
    attendanceRecords = await getAttendanceByRc(rc_id);
    message = "Attendance records retrieved successfully";
  }

  if (attendanceRecords.length === 0) {
    res.status(httpStatus.OK).json({
      success: false,
      data: [],
      count: 0,
      message: "No attendance records found for this RC",
    });
    return;
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: attendanceRecords,
    count: attendanceRecords.length,
    message: message,
  });
}

export async function getAllAttendanceController(req: AuthRequest, res: Response) {
  const { date } = req.query;
  let attendanceRecords;
  let message;

  if (date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date as string)) {
      throw AppError("Date must be in YYYY-MM-DD format", httpStatus.BAD_REQUEST);
    }

    attendanceRecords = await fetchAllAttendanceByDate(date as string);
    message = `Attendance records for ${date} retrieved successfully`;
  } else {
    attendanceRecords = await fetchAllAttendance();
    message = "All attendance records retrieved successfully";
  }

  if (attendanceRecords.length === 0) {
    const errorMessage = date 
      ? `No attendance records found for date: ${date}` 
      : "No attendance records found";
    res.status(httpStatus.OK).json({
      success: false,
      data: [],
      count: 0,
      message: errorMessage,
    });
    return;
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: attendanceRecords,
    count: attendanceRecords.length,
    message: message,
  });
}

