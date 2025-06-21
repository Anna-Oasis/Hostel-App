import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
import { getRCidfromUserId } from "../services/helper";
import { getRCById } from "../services/rcServices";
import { fetchStudentDetailsForRC } from "../services/studentServices";

export const fetchStudentDetailsForRcController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
    if (!req.User || !req.User.id || !req.User.role) {
        throw AppError(
        "User information is missing from request",
        httpStatus.UNAUTHORIZED
        );
    }

    const rc_id = await getRCidfromUserId(Number(req.User.id));
    if (!rc_id) {
    throw AppError("RC not found for the user", httpStatus.NOT_FOUND);
    }

    const rc = await getRCById(Number(rc_id));
    if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
    }

    if(!rc[0].floor || !rc[0].hostel){
    throw AppError("RC hostel details not found", httpStatus.NOT_FOUND);
    }

    const students = await fetchStudentDetailsForRC(rc[0].floor, rc[0].hostel);

    if (!students || students.length === 0) {
        res.status(httpStatus.OK).json({
            success: false,
            data: [],
            message: "No student records found",
        });
        return;
    }

    res.status(httpStatus.OK).json({
        success: true,
        data: students,
        message: "Fetched student details successfully",
    });
};

