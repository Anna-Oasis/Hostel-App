import { fetchRoomDetailsByBlockAndAcademicYear, fetchRoomDetailsByAcademicYear } from "../services/roomServices";
import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
import { getRCByUserId } from "../services/rcServices";
import { hostelBlock } from "../constants/enum";

export const fetchRoomDetailsByBlockAndAcademicYearController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { academicYear } = req.params;

  if (!academicYear || !/^\d{4}-\d{4}$/.test(academicYear)) {
    throw AppError("Invalid academic year format. Use YYYY-YYYY.", httpStatus.BAD_REQUEST);
  }

  if (!req.User) {
    throw AppError("User information missing", httpStatus.UNAUTHORIZED);
  }

  let hostelBlockValue: string | undefined;

  if (req.User.role === "rc") {
    // ✅ RC should NOT read from body
    const rc = await getRCByUserId(Number(req.User.id));
    if (!rc?.[0]?.hostel) {
      throw AppError("RC's hostel block info not found", httpStatus.NOT_FOUND);
    }
    hostelBlockValue = rc[0].hostel;

  } else if (req.User.role === "executiveWarden" || req.User.role === "deputyWarden") {
    // ✅ Only these roles use body
    const { hostel_block } = req.body || {};

    if (!hostel_block || typeof hostel_block !== "string") {
      throw AppError("hostel_block is required in request body", httpStatus.BAD_REQUEST);
    }

    const validBlocks = Object.values(hostelBlock);
    if (!validBlocks.includes(hostel_block)) {
      throw AppError(`Invalid hostel block. Must be one of: ${validBlocks.join(", ")}`, httpStatus.BAD_REQUEST);
    }

    hostelBlockValue = hostel_block;

  } else {
    throw AppError("Unauthorized role for this operation", httpStatus.FORBIDDEN);
  }

  const roomDetails = await fetchRoomDetailsByBlockAndAcademicYear(
    hostelBlockValue,
    academicYear
  );

  if (!roomDetails?.length) {
    throw AppError("No room data found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    count: roomDetails.length,
    data: roomDetails,
    message: "Room details fetched successfully",
  });
};

export const fetchRoomDetailsByAcademicYearController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { academicYear } = req.params;

  if (!academicYear || !/^\d{4}-\d{4}$/.test(academicYear)) {
    throw AppError("Invalid academic year format. Use YYYY-YYYY.", httpStatus.BAD_REQUEST);
  }

  const roomDetails = await fetchRoomDetailsByAcademicYear(academicYear);

  if (!roomDetails?.length) {
    throw AppError("No room data found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    count: roomDetails.length,
    data: roomDetails,
    message: "Room details fetched successfully",
  });
};


/*export const fetchRoomDetailsByBlockAndAcademicYearController = async (
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

  if (rc[0].hostel == null) {
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
*/