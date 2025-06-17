import { Request, Response } from "express";
import { createGrievance, getGrievancesByRollNumber } from "../services/grievanceService";
import httpStatus from "http-status";
import { AppError } from "../utils/AppError";


export const createGrievanceController = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await createGrievance(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    data: result,
    message: "Grievance created successfully",
  });
};

export const getGrievancesByRollNumberController = async (req: Request, res: Response): Promise<void>=> {
  const rollNumber = req.params.roll_number;
  
  const result = await getGrievancesByRollNumber(rollNumber);

  if (result.length === 0) {
    throw AppError("No grievances found for the provided roll number", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: "Grievances fetched successfully",
  });
};
