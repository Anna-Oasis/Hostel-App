import { Response } from "express";
import { createGrievance, getGrievancesForDeputyWarden, getGrievancesByRollNumber} from "../services/grievanceService";
import { updateGrievanceStatus } from "../services/grievanceService";
import { AuthRequest } from "../types/roles";
import { getGrievancesForManager, getGrievancesForRC } from "../services/grievanceService";
import httpStatus from "http-status";
import { AppError } from "../utils/AppError";
import {  
  rcGrievanceDecisionSchema 
} from "../validation/grievance.schema";
import { getRCById, getRCByUserId } from "../services/rcServices";
import { createGrievanceSchema } from "../validation/grievance.schema";
import { getRCidfromUserId, getRollNoFromUserId } from "../services/helper";
import { grievanceApprovalStatus} from "../constants/enum";
import { isBooleanObject } from "util/types";


export const createGrievanceController = async (req: AuthRequest, res: Response) => {
  if (!req.User) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const rollNo = await getRollNoFromUserId(Number(req.User.id));
  if (!rollNo) {
    throw AppError("Roll number not found for user", httpStatus.NOT_FOUND);
  }

  const validated = createGrievanceSchema.parse(req.body);

  const grievanceData = {
    ...validated,
    roll_number: rollNo,
  };
  const result = await createGrievance(grievanceData);

  if(!result){
    throw AppError(
      "Failed to create grievance",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  res.status(httpStatus.CREATED).json({
    success: true,
    data: result,
    count:result.length,
    message: "Grievance created successfully",
  });
};

export const getGrievancesByUserController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const rollNumber = await getRollNoFromUserId(Number(req.User.id));
  if (!rollNumber) {
    throw AppError("Roll number not found for user", httpStatus.NOT_FOUND);
  }
  console.log("Roll Number:", rollNumber);

  const result = await getGrievancesByRollNumber(rollNumber);

  res.status(httpStatus.OK).json({
  success: true,
  data: result || [],
  count:result ? result.length : 0,
  message:result && result.length > 0 
  ? "Grievances fetched successfully"
  :  "No Grievances found ",
});
}

export const viewGrievancesByRCController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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

  const result = await getGrievancesForRC(rc[0].hostel, rc[0].floor);

  res.status(httpStatus.OK).json({
  success: true,
  data: result || [],
  count:result ? result.length : 0,
  message:result && result.length > 0 
  ? "Grievances fetched successfully"
  :  "No Grievances found ",
});
}

export const approveOrDeclineGrievancesByRCController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
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

  console.log("RC Details:", rc);

  const grievanceId=Number(req.params.grievance_id);

  const validated=rcGrievanceDecisionSchema.parse(req.body);
  let status;

  if(validated.approve)
    status=grievanceApprovalStatus.RC;
  else
    status=grievanceApprovalStatus.DECLINED;

  const updateResult = await updateGrievanceStatus({
    grievance_id: grievanceId,
    status,
    updatedBy: req.User.role
  });

  if (!updateResult) {
    throw AppError("Failed to update grievance status", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data:    updateResult || [],
    count:   updateResult ? updateResult.length : 0,
    message: "Grievance approval submitted successfully",
    status:  validated.approve ? "Approved" : "Declined",
  });
};

export const getGrievancesForManagerController=async (req:AuthRequest,res:Response)=>
{
  const result = await getGrievancesForManager();

  res.status(httpStatus.OK).json({
    success: true,
    data: result || [],
    count:result ? result.length : 0,
    message:result && result.length > 0 
    ? "Grievances fetched successfully"
    :  "No Grievances found ",
  });
}

export const resolveGrievanceByManagerController = async (req: AuthRequest,res:Response)=>
{
    if (!req.User) {
      throw AppError(
        "User information is missing from request",
        httpStatus.UNAUTHORIZED
      );
    }

    const grievanceId=Number(req.params.grievance_id);
    const data = await updateGrievanceStatus({
      grievance_id: grievanceId,
      status: grievanceApprovalStatus.MANAGER,
      updatedBy: req.User.role
    });

    if (!data) {
      throw AppError("Failed to update grievance", httpStatus.INTERNAL_SERVER_ERROR);
    }

    res.status(httpStatus.OK)
    .json(
      {
        success:true,
        data:data,
        count:data.length,
        message:"Grievance Resolved Successfully"
      }
    );
}

export const getGrievancesForDeputyWardenController = async (req:AuthRequest,res:Response)=>
{
    const result = await getGrievancesForDeputyWarden();

    res.status(httpStatus.OK).json({
      success: true,
      data: result || [],
      count:result ? result.length : 0,
      message:result && result.length > 0 
      ? "All grievances are fetched for Deputy Warden successfully"
      :  "No Grievances found ",
    });
}
