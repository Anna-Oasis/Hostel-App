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
  if (!req.User || !req.User.id || !req.User.role) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const rc = await getRCByUserId(Number(req.User.id));
  if (!rc || rc.length === 0 || !rc[0].floor || !rc[0].hostel) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }
  const room = await fetchRoomDetailsByBlockAndAcademicYear(
    rc[0].hostel,
    academicYear
  );
  if (!room || room.length === 0) {
    res.status(httpStatus.OK).json({
    success: false,
    data: [],
    message: "No rooms found for the specified block and academic year",
  });
    return 
  }
  // if (!room) {
  //   throw AppError(
  //     "Can't fetch room details",
  //     httpStatus.INTERNAL_SERVER_ERROR
  //   );
  // }

  res.status(httpStatus.OK).json({
    success: true,
    data: room,
    message: "Fetched room details successfully",
  });
};
