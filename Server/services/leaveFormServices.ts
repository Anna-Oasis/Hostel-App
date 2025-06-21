import express,{Router} from "express";
import { db } from "../config/dbConnection";
import { eq } from "drizzle-orm";
import { leaveFormModel ,NewLeaveForm} from "../models/leaveForm";

export const getLeaveFormApprovals=async(rollNumber:string)=>
{
    return await db
            .select(
                {
                    Id:leaveFormModel.id,
                    rollNumber:leaveFormModel.roll_number,
                    leaveType:leaveFormModel.leave_type,
                    fromDate:leaveFormModel.from_date,
                    toDate:leaveFormModel.to_date,
                    addressOfStay:leaveFormModel.address_of_stay,
                    emergencyContact:leaveFormModel.emergency_contact,
                    status:leaveFormModel.status,
                    createAt:leaveFormModel.created_at,
                    updatedAt:leaveFormModel.updated_at
                }
            )
            .from(leaveFormModel)
            .where(eq(leaveFormModel.roll_number,rollNumber));
}

export const createLeaveForm = async(data:NewLeaveForm)=>
{
    return await db.insert(leaveFormModel).values(data).returning();
}

