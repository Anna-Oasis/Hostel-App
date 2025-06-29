import { Response } from "express";
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
import { getRCById, getRCByUserId } from "../services/rcServices";

export async function createAttendanceByRcController(req: AuthRequest, res: Response) {

  const validatedData = createAttendanceSchema.parse(req.body);

  if (!req.User?.id) {
    throw AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }
  const rcDetailsArray = await getRCByUserId(Number(req.User.id));
  
  const rc_id = Number(rcDetailsArray[0].id);

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
  if (!req.User?.id){
    throw AppError("User not authenticated", httpStatus.UNAUTHORIZED);
  }
  const rcDetailsArray = await getRCByUserId(Number(req.User.id));
  const alternatingRCId = rcDetailsArray[0].alternatingToRCId;
  const rc_id = rcDetailsArray[0].id;
  
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
    attendanceRecords = await getAttendanceByRc(rc_id);
    message = "Attendance records retrieved successfully";
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: attendanceRecords|| [],
    count: attendanceRecords?attendanceRecords.length:0,
    message: attendanceRecords && attendanceRecords.length >0
    ? message
    : "No attendance records found for this RC",
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
  const errorMessage = date 
      ? `No attendance records found for date: ${date}` 
      : "No attendance records found";

  res.status(httpStatus.OK).json({
    success: true,
    data: attendanceRecords || [],
    count: attendanceRecords?attendanceRecords.length:0,
    message:attendanceRecords && attendanceRecords.length >0
    ? message
    :errorMessage,
  });

}

