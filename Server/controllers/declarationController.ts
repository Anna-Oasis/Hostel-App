import { declarationModel } from "../models/declarationModel";
import { AuthRequest} from "../types/roles";
import httpStatus from "http-status";
import { response, Response } from "express";
import {getLatestDeclaration, postDeclaration} from '../services/declarationServices';
import { declaration } from "../constants/enum";
import AppError from "../utils/AppError";

export const getLatestDeclarationFromController = async (req:AuthRequest,res:Response)=>
{
    const type:string=req.params.type;
    const allowedTypes = Object.values(declaration);

    if (!type || !allowedTypes.includes(type)) 
    {
        
        throw AppError("Invalid Data Passed",httpStatus.BAD_REQUEST);
    }

    const data  = await getLatestDeclaration(type);

    if(data.length === 0 || data === null)
    {
        res.status(httpStatus.INTERNAL_SERVER_ERROR)
        .json(
            {
                success:true,
                message:'Internal Server Error',
                data:data
            }
        );
    }
        
    else{
        res.status(httpStatus.OK)
        .json(
            {
                message:"Success! Declarations fetched Successfully",
                success:true,
                data:data
            }
        );
    }
}

export const postDeclarationFromController = async (req:AuthRequest,res:Response)=>
{
    const {type,declarations} = req.body;
    const allowedTypes = Object.values(declaration);

    if(!type || !allowedTypes.includes(type)
    || !Array.isArray(declarations) || declarations.length === 0)
    {
        throw AppError("Invalid Declaration has been passed",httpStatus.BAD_REQUEST);
    }

    await postDeclaration(type,declarations);

    res.status(httpStatus.OK)
    .json(
        {
            message:"Declaration has been Inserted Successfully",
            success:true,
        }
    );

}