import { Request,Response } from "express";
import { createLeaveForm,getLeaveFormApprovals} from "../services/leaveFormServices";
import AppError from "../utils/AppError";
import  httpStatus  from "http-status";
import { leaveFormSchema } from "../validation/leaveform.schema";
import { AuthRequest } from "../types/roles";

export const createLeaveFormFromController = async (req:AuthRequest,res:Response) =>
{
    //validation
    const validatedData=leaveFormSchema.safeParse(req.body);

    if(!validatedData.success)
    {
        throw AppError(
            validatedData.error.issues.map((issue) => issue.message).join(", "),
            httpStatus.BAD_REQUEST
        );
    }

    const result = await createLeaveForm(validatedData.data);

    res.status(httpStatus.OK)
    .json({
        success:true,
        message:"New Leave Form Created",
        data:result
    });

}

export const getAllLeaveFormsFromController = async (req:AuthRequest,res:Response) :Promise<void> =>
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