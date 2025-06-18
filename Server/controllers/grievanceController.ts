import { Request, Response } from "express";
import { createGrievance, getGreivancesForDeputyWarden, getGrievancesByRollNumber } from "../services/grievanceService";
import { AuthRequest } from "../types/roles";
import { getGrievancesForManager, resolveGrievanceByManager } from "../services/grievanceService";
import httpStatus from "http-status";
import { AppError } from "../utils/AppError";

export const createGrievanceController = async (req: AuthRequest, res: Response) => {
  const data = req.body;
  const result = await createGrievance(data);

  res.status(httpStatus.CREATED).json({
    success: true,
    data: result,
    message: "Grievance created successfully",
  });
};

export const getGrievancesByRollNumberController = async (req: AuthRequest, res: Response): Promise<void>=> {
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

export const getGreivancesForManagerFromController=async (req:AuthRequest,res:Response)=>
{
    const data=await getGrievancesForManager();

    if(data.length===0)
    {
      throw AppError("No Greivances Found",httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.OK)
    .json(
      {
        success:true,
        data:data,
        message:"Greivances Fetched Successfully"
      }
    )
}

export const resolveGrievanceFromController = async (req: AuthRequest,res:Response)=>
{
    const greivanceId=Number(req.params.grievance_id);
    const data=await resolveGrievanceByManager(greivanceId);

    if(data.length===0)
    {
      throw AppError("Greivance with Greivance ID not Found",httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.OK)
    .json(
      {
        success:true,
        data:data,
        message:"Greivance Resolved Successfully"
      }
    );
}

export const getGrievancesFromDeputyWardenController = async (req:AuthRequest,res:Response)=>
{

    const data = await getGreivancesForDeputyWarden();

    if(data.length === 0)
    {
      throw AppError("Error Fetching Greivances From Deputy Warden Side",httpStatus.INTERNAL_SERVER_ERROR);
    }

    res.status(httpStatus.OK)
    .json(
      {
        success:true,
        message:"Greivances all are fetched from Deputy Warden Side",
        data:data
      }
    );
}
