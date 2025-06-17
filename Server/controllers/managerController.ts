import { Response,Request} from "express";
import { AuthenticatedRequest } from "../types/roles";
import { resolveGrievance, getGrievances } from "../services/managerService";
import AppError from "../utils/AppError";
import httpStatus from "http-status";


export const getGreivancesForManagerFromController=async (req:Request,res:Response)=>
{
    const data=await getGrievances();

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

export const resolveGrievanceFromController = async (req:Request,res:Response)=>
{
    const greivanceId=Number(req.params.grievance_id);
    const data=await resolveGrievance(greivanceId);

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
