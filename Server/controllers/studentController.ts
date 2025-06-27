import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
import { getRCidfromUserId } from "../services/helper";
import { getRCById, getRCByUserId } from "../services/rcServices";
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
    const rc = await getRCByUserId(Number(req.User.id));

    if(!rc[0].floor || !rc[0].hostel){
    throw AppError("RC hostel details not found", httpStatus.NOT_FOUND);
    }
    console.log("RC Details:", rc);
    const students = await fetchStudentDetailsForRC(rc[0].floor, rc[0].hostel);
    console.log(students)

    res.status(httpStatus.OK).json({
        success: true,
        data: students || [],
        count : students ? students.length:0,
        message:students && students.length >0 
        ?"Fetched student details successfully"
        : "No student records found",
    });
};

