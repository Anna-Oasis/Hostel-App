import express,{raw, Request,Response} from 'express';
import {createSummerVacationForm,getSummerVacationFormsForRC} from '../services/summerVacationServices';
import AppError from '../utils/AppError';
import httpStatus from 'http-status';
import { summerVacationSchema } from '../validation/summerVacation.schema';
import {approveSummerVacationFormByRC,
    approveSummerVacationByDeputyWarden,getSummerVacationFormsForDeputyWarden,getAllSummerVacationForms
} from '../services/summerVacationServices';
import { AuthRequest} from '../types/roles';
import { isBooleanObject } from 'node:util/types';

export const createSummerVacationFromController = async (
  req: AuthRequest,
  res: Response
) => {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    throw AppError("No data provided", httpStatus.BAD_REQUEST);
  }

  const validation = summerVacationSchema.safeParse(data);

  if (!validation.success) {
    const message =
      validation.error.errors[0]?.message || "Validation failed";
    throw AppError(message, httpStatus.NOT_ACCEPTABLE);
  }

  
  const result = await createSummerVacationForm(validation.data);

  if (!result || result.length === 0) {
    throw AppError("Internal error while generating leave form", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "New leave form has been created",
    data: result,
  });
};

export const getAllSummerVacationFormsFromController = async (req:AuthRequest,res:Response): Promise<void> =>
{ 
    const rollNumber=req.params.roll_number;

    if(!rollNumber)
    {
        throw AppError("No Data is passed",httpStatus.BAD_REQUEST);
    }

    const result=await getAllSummerVacationForms(rollNumber);

    if(!result || result.length === 0)
    {
        throw AppError("No Data Found for Summer Vacation Form",httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.FOUND)
    .json(
        {
            success:true,
            message:"All available Summer Vacation forms are fetched Successfully",
            data:result
        }
    );
} 

export const approveSummerVacationFormByRCController = async (req:AuthRequest,res:Response) =>
{
    const summerVacationID = Number(req.params.summer_vacation_id);
    const approval = Boolean(req.body.approve);

    if(!summerVacationID || isNaN(summerVacationID) || typeof approval !== "boolean")
    {
        throw AppError("Inconsistent Data passed",httpStatus.BAD_REQUEST);
    }

    const user_id = Number(req.user?.id);
    const {comment} =req.body;

    await approveSummerVacationFormByRC(summerVacationID,user_id,approval,comment);

    res.status(httpStatus.OK)
    .json(
        {
            success:true,
            message: `The summer vacation form has been ${approval ? "approved" : "declined"} successfully.`
        }
    );
}

export const approveSummerVacationDeputyWardenController = async(req:AuthRequest,res:Response) =>
{
    const summerVacationID=Number(req.params.summer_vacation_id);

    if(isNaN(summerVacationID))
    {
        throw AppError("Inconsistent Data passed here",httpStatus.BAD_REQUEST);
    }
    
    const user_id = Number(req.user?.id);

   await approveSummerVacationByDeputyWarden(user_id,summerVacationID);

    res.status(httpStatus.OK)
    .json(
        {
            success:true,
            message:"Vacation form approved by deputy Warden",
        }
    );
}

export const getSummerVacationFormsForDeputyWardenController = async (req:AuthRequest,res:Response)=>
{

    const result = await getSummerVacationFormsForDeputyWarden();

    if(!result || result.length === 0)
    {
        throw AppError("No pending summer vacation forms for Deputy Warden",httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.OK)
    .json(
        {
            message:"Data has been Fetched successfully",
            success:true,
            data:result
        }
    );
}

export const getSummerVacationFormsForRCFromController = async(req:AuthRequest,res:Response) =>
{
    const rc_id=Number(req.params.id);

    if(isNaN(rc_id))
    {
        throw AppError("Invalid RC ID has been passed",httpStatus.BAD_REQUEST);
    }

    const result = await getSummerVacationFormsForRC(rc_id);

    if(result.length === 0)
    {
        throw AppError("There are no Summer Vacation form Available or Internal Server Error",httpStatus.INTERNAL_SERVER_ERROR);
    }

    res.status(httpStatus.OK)
        .json(
            {
                success:true,
                message:"All Summer Vacation Forms are fetched Successfully",
                data:result
            }
        );
}