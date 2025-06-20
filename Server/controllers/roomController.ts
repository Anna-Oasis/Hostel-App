import { fetchRoomDetailsByBlockAndAcademicYear } from "../services/roomServices";
import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import { fetchRoomsSchema } from "../validation/room.schema";
import httpStatus from "http-status";
import { Request, Response } from "express";

export const fetchRoomDetailsByBlockAndAcademicYearController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User || !req.User.id || !req.User.role) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  if (req.User.role ==="student")
  {
    throw AppError(
      "Invalid User!", httpStatus.UNAUTHORIZED
    );
  }

  const validated=fetchRoomsSchema.parse(req.body);

  const room=fetchRoomDetailsByBlockAndAcademicYear(validated.hostelBlock, validated.academicYear)

  if (!room) {
    throw AppError(
      "Can't fetch room details",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: room,
    message: "Fetched room details successfully",
  });
};