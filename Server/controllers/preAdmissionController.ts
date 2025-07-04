import {
  createPreadmission,
  getPreadmissions,
  getPreadmissionByEmail,
} from "../services/preAdmissionServices";
import { Request, Response } from "express";
import { preAdmissionSchema } from "../validation/preadmission.schema";
import AppError from "../utils/AppError";
import httpStatus from "http-status";

export const createPreAdmissionController = async (
  req: Request,
  res: Response
) => {
  const preAdmissionData = req.body;

  const validated = preAdmissionSchema.parse(preAdmissionData);

  const existingPreadmission = await getPreadmissionByEmail(validated.email);
  if (existingPreadmission) {
    throw AppError(
      "Preadmission with this email already exists. Please use a different email.",
      httpStatus.BAD_REQUEST
    );
  }

  const newPreadmission = await createPreadmission({
    ...validated,
    submittedAt: new Date(),
  });
  res.status(201).json({
    success: true,
    message: "Preadmission created successfully",
    data: newPreadmission,
  });
};

export const getPreAdmissionsController = async (
  req: Request,
  res: Response
) => {
  const preAdmissions = await getPreadmissions();
  res.status(200).json({
    success: true,
    message: "Preadmissions retrieved successfully",
    data: preAdmissions,
  });
};
