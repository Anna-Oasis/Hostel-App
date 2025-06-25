import { Response } from "express";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { summerVacationSchema } from "../validation/summerVacation.schema";
import {
  createSummerVacationForm,
  approveSummerVacationFormByRC,
  approveSummerVacationByDeputyWarden,
  getSummerVacationFormsForDeputyWarden,
  getAllSummerVacationForms,
  getAllSummerVacationFormsWithStudentDetailsFilterByBlockAndFloor,
} from "../services/summerVacationServices";
import { AuthRequest } from "../types/roles";
import { getRollNoFromUserId, getRCidfromUserId } from "../services/helper";
import { getRCById } from "../services/rcServices";

export const createSummerVacationFromController = async (
  req: AuthRequest,
  res: Response
) => {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    throw AppError("No data provided", httpStatus.BAD_REQUEST);
  }

  const validatedData = summerVacationSchema.parse(data);

  const result = await createSummerVacationForm(validatedData);

  if (!result || result.length === 0) {
    throw AppError(
      "Internal error while generating leave form",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "New leave form has been created",
    data: result,
  });
};

export const getAllSummerVacationFormsOfStudent = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User || !req.User.id) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }
  const UserId = req.User.id;
  const rollNumber = await getRollNoFromUserId(Number(UserId));

  if (!rollNumber) {
    throw AppError("No Data is passed", httpStatus.BAD_REQUEST);
  }

  const result = await getAllSummerVacationForms(rollNumber);

  if (!result || result.length === 0) {
    res.status(httpStatus.OK).json({
      success: false,
      message: "No Summer vacation forms found",
      data: [],
    });
    return;
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "All available Summer Vacation forms are fetched Successfully",
    data: result,
  });
};

export const approveSummerVacationFormByRCController = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.User || !req.User.id) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }
  const userId = req.User.id;
  const summerVacationID = Number(req.params.summer_vacation_id);
  const { approve, comment } = req.body;
  if (
    !summerVacationID ||
    isNaN(summerVacationID) ||
    typeof approve !== "boolean"
  ) {
    throw AppError("Inconsistent Data passed", httpStatus.BAD_REQUEST);
  }
  if (approve === false && !comment) {
    throw AppError(
      "Comment is required when declining the form",
      httpStatus.BAD_REQUEST
    );
  }
  await approveSummerVacationFormByRC(
    summerVacationID,
    Number(userId),
    approve,
    comment
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: `The summer vacation form has been ${
      approve ? "approved" : "declined"
    } successfully.`,
  });
};

export const approveSummerVacationDeputyWardenController = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.User || !req.User.id) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const userId = req.User.id;
  const summerVacationID = Number(req.params.summer_vacation_id);
  const { approve, comment } = req.body;

  if (
    !summerVacationID ||
    isNaN(summerVacationID) ||
    typeof approve !== "boolean"
  ) {
    throw AppError("Inconsistent Data passed", httpStatus.BAD_REQUEST);
  }

  if (approve === false && !comment) {
    throw AppError(
      "Comment is required when declining the form",
      httpStatus.BAD_REQUEST
    );
  }

  await approveSummerVacationByDeputyWarden(
    Number(userId),
    summerVacationID,
    approve,
    comment
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: `Vacation form ${
      approve ? "approved" : "declined"
    } by deputy warden successfully`,
  });
};

export const getSummerVacationFormsForDeputyWardenController = async (
  req: AuthRequest,
  res: Response
) => {
  const result = await getSummerVacationFormsForDeputyWarden();

  if (!result || result.length === 0) {
    res.status(httpStatus.OK).json({
      success: false,
      message: "Nothing to approve",
      data: [],
    });
    return;
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Data has been Fetched successfully",
    data: result,
  });
};

export const getSummerVacationFormsForRCController = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.User || !req.User.id) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const rcId = await getRCidfromUserId(Number(req.User.id));
  if (!rcId || isNaN(rcId)) {
    throw AppError("Invalid RC id", httpStatus.BAD_REQUEST);
  }
  const RCs = await getRCById(rcId);
  console.log("RCs", RCs);
  if (!RCs || RCs.length === 0) {
    throw AppError("No such RC exists", httpStatus.BAD_REQUEST);
  }
  const RC = RCs[0];
  const floors = RC.floor ? RC.floor : [];
  const hostelBlock = RC.hostel;

  const result =
    await getAllSummerVacationFormsWithStudentDetailsFilterByBlockAndFloor(
      hostelBlock,
      floors
    );

  if (!result || result.length === 0) {
    res.status(httpStatus.OK).json({
      success: false,
      message: "No records found",
      data: [],
    });
    return;
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "All Summer Vacation Forms are fetched Successfully",
    data: result,
  });
};
