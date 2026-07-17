import { Response } from "express";
import httpStatus from "http-status";
import { generateManagerAttendanceReport } from "../services/managerAttendanceReportService";
import { AuthRequest } from "../types/roles";
import { managerAttendanceReportSchema } from "../validation/managerAttendanceReport.schema";

export const getManagerAttendanceReportController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const filters = managerAttendanceReportSchema.parse(req.body);
  const report = await generateManagerAttendanceReport(filters);

  res.status(httpStatus.OK).json({
    success: true,
    ...report,
    message: "Attendance report generated successfully",
  });
};

