import { Request,Response } from "express";
import { createLeaveForm,getLeaveFormApprovals} from "../services/leaveFormServices";
import AppError from "../utils/AppError";
import  httpStatus  from "http-status";

export const createLeaveFormFromController = async (req:Request,res:Response) =>
{
    const data=req.body;

    if(!data || data.length === 0)
    {
        throw AppError("Undefined Data Passed here",httpStatus.BAD_REQUEST);
    }

    const result = await createLeaveForm(data);

    res.status(httpStatus.OK)
    .json({
        success:true,
        message:"New Leave Form Created",
        data:result
    });

}

export const getAllLeaveFormsFromController = async (req:Request,res:Response) :Promise<void> =>
{
    const rollNumber=req.params.roll_number;

    if(!rollNumber)
    {
        throw AppError("Invalid or No Data is passed",httpStatus.BAD_REQUEST);
    }

    const result=await getLeaveFormApprovals(rollNumber);

    if(!result || result.length === 0)
    {
        res.status(httpStatus.NOT_FOUND)
        .json(
            {
                success:true,
                message:"No Leave Form Exists",
            }
        )

        throw AppError("No Data Found for Leave Form",httpStatus.NOT_FOUND);
    }

    res.status(httpStatus.FOUND)
    .json(
        {
            success:true,
            message:"All available leave forms are fetched Successfully",
            data:result
        }
    );

}