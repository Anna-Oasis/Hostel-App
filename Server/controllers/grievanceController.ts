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
import { getRCById } from "../services/rcServices";
import { createGrievanceSchema } from "../validation/grievance.schema";
import { getRCidfromUserId, getRollNoFromUserId } from "../services/helper";
import { grievanceApprovalStatus} from "../constants/enum";


export const createGrievanceController = async (req: AuthRequest, res: Response) => {
  if (!req.User || !req.User.id || !req.User.role) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  if(req.User.role !== "student"){
    throw AppError(
      "Invalid User!",
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
    message: "Grievance created successfully",
  });
};

export const getGrievancesByUserController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User || !req.User.id || !req.User.role) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  if (req.User.role !== "student") {
    throw AppError("Invalid User!", httpStatus.UNAUTHORIZED);
  }

  const rollNumber = await getRollNoFromUserId(Number(req.User.id));
  if (!rollNumber) {
    throw AppError("Roll number not found for user", httpStatus.NOT_FOUND);
  }
  console.log("Roll Number:", rollNumber);
  const result = await getGrievancesByRollNumber(rollNumber);

  if (result.length === 0) {
    res.status(httpStatus.OK).json({
      success: false,
      data: [],
      message: "No grievances found for this user",
    });
    return;
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: "Grievances fetched successfully",
  });
};


export const viewGrievancesByRCController = async (
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

  if(!rc[0].hostel || !rc[0].floor){
    throw AppError("Hostel or floor is not assigned to RC", httpStatus.NOT_FOUND);
  }

  if (rc[0].hostel == null || rc[0].floor == null) {
    throw AppError("RC hostel or floor information is missing", httpStatus.INTERNAL_SERVER_ERROR);
  }
  const grievances = await getGrievancesForRC(rc[0].hostel, rc[0].floor);

  if (!grievances || grievances.length === 0) {
    res.status(httpStatus.OK).json({ 
      success: false, 
      data: [],
      message: "No grievances found",
    });
    return;
  }

  res.status(httpStatus.OK).json({ 
    success: true, 
    data: grievances,
    message: "Fetched Grievances successfully",
  });
};


export const approveOrDeclineGrievancesByRCController = async (
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
    message: "Grievance approval submitted successfully",
    status: validated.approve ? "Approved" : "Declined",
  });
};


export const getGrievancesForManagerController=async (req:AuthRequest,res:Response)=>
{
    if (!req.User || !req.User.id || !req.User.role) {
      throw AppError(
        "User information is missing from request",
        httpStatus.UNAUTHORIZED
      );
    }

    if(req.User.role !== "manager"){
      throw AppError(
        "Invalid User!",
        httpStatus.UNAUTHORIZED
      );
    }

    const data = await getGrievancesForManager();

    if (data.length === 0) {
      res.status(httpStatus.OK).json({
      success: false,
      data: [],
      message: "No Grievances Found"
      });
      return;
    }

    res.status(httpStatus.OK).json({
      success: true,
      data: data,
      message: "Grievances Fetched Successfully"
    });
}

export const resolveGrievanceByManagerController = async (req: AuthRequest,res:Response)=>
{
    if (!req.User || !req.User.id || !req.User.role) {
      throw AppError(
        "User information is missing from request",
        httpStatus.UNAUTHORIZED
      );
    }

    if(req.User.role !== "manager"){
      throw AppError(
        "Invalid User!",
        httpStatus.UNAUTHORIZED
      );
    }

    const grievanceId=Number(req.params.grievance_id);
    const data = await updateGrievanceStatus({
      grievance_id: grievanceId,
      status: grievanceApprovalStatus.MANAGER,
      updatedBy: req.User.role
    });

    if(data.length===0)
    {
      throw AppError("Grievance with Grievance ID not Found",httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.OK)
    .json(
      {
        success:true,
        data:data,
        message:"Grievance Resolved Successfully"
      }
    );
}

export const getGrievancesForDeputyWardenController = async (req:AuthRequest,res:Response)=>
{
    if (!req.User || !req.User.id || !req.User.role) {
      throw AppError(
        "User information is missing from request",
        httpStatus.UNAUTHORIZED
      );
    }

    if(req.User.role !== "deputyWarden"){
      throw AppError(
        "Invalid User!",
        httpStatus.UNAUTHORIZED
      );
    }

    const data = await getGrievancesForDeputyWarden();

    if (data.length === 0) {
      res.status(httpStatus.OK).json({
      success: false,
      data: [],
      message: "No grievances found for Deputy Warden"
      });
      return;
    }

    res.status(httpStatus.OK).json({
      success: true,
      message: "All grievances are fetched for Deputy Warden",
      data: data
    });
}
