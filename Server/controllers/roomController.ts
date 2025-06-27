import { fetchRoomDetailsByBlockAndAcademicYear } from "../services/roomServices";
import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
import { getRCByUserId } from "../services/rcServices";

export const fetchRoomDetailsByBlockAndAcademicYearController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { academicYear } = req.params;

  if (!academicYear || academicYear.length !== 9 || !/^\d{4}-\d{4}$/.test(academicYear)) {
    throw AppError(
      "Invalid academic year format. It should be in YYYY-YYYY format.",
      httpStatus.BAD_REQUEST
    );
  }

  if (!req.User) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const rc = await getRCByUserId(Number(req.User.id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  if (rc[0].hostel == null || rc[0].floor == null) {
    throw AppError("RC hostel or floor information is missing", httpStatus.INTERNAL_SERVER_ERROR);
  }

  const room = await fetchRoomDetailsByBlockAndAcademicYear(
    rc[0].hostel,
    academicYear
  );

  if (!room || room.length === 0) {
    throw AppError(
      "No rooms found for the specified block and academic year",
      httpStatus.NOT_FOUND
    );
  }

  res.status(httpStatus.OK).json({
    success: true,
    count: room.length,
    data: room,
    message: "Fetched room details successfully",
  });
};
