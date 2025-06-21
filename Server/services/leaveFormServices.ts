import express,{Router} from "express";
import { db } from "../config/dbConnection";
import { eq } from "drizzle-orm";
import { leaveFormModel ,NewLeaveForm} from "../models/leaveForm";

export const getLeaveFormApprovals=async(rollNumber:string)=>
{
    return await db
            .select()
            .from(leaveFormModel)
            .where(eq(leaveFormModel.roll_number,rollNumber));
}

export const createLeaveForm = async(data:NewLeaveForm)=>
{
    return await db.insert(leaveFormModel).values(data).returning();
}

