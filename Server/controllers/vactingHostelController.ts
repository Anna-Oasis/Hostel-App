import { Request, Response } from "express";
import httpStatus from "http-status";
import { vacatingFormSchema } from "../validation/vacatingHostel.schema";
import {
  createVacatingHostelForm,
  getAllVacatingHostelForms,
} from "../services/vacatingHostelService";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../types/roles";

export async function createVacatingHostelFormController(req: AuthRequest, res: Response) {
  if (!req.body) {
    throw AppError("Request body is required", httpStatus.BAD_REQUEST);
  }

  const validatedData = vacatingFormSchema.parse(req.body);

  const dbReadyData = {
    ...validatedData,
    vacating_date: validatedData.vacating_date.toISOString().split("T")[0],
    vacating_time: validatedData.vacating_time,
  };

  const result = await createVacatingHostelForm(dbReadyData);

  res.status(httpStatus.CREATED).json({
    success: true,
    data: result,
    message: "Vacating hostel form submitted successfully",
  });
}

export async function getAllVacatingHostelFormsController(req: AuthRequest, res: Response) {
  const result = await getAllVacatingHostelForms();

  if (!result || result.length === 0) {
    throw AppError("No vacating hostel forms found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: "Vacating hostel forms fetched successfully",
  });
}
