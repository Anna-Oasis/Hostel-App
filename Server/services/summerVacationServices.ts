import express , { Request,Response } from "express";
import {summerVacationModel,NewSummerVacation} from '../models/summerVacation';
import { db } from "../config/dbConnection";
import { eq ,and, inArray} from "drizzle-orm";
import { summerVacationApprovalsModel } from "../models/summerVacationApprovals";
import { approval_status, hostel_block } from "../constants/enum";
import { JWTPayload } from "../types/roles";
import AppError from "../utils/AppError";
import { rcModel } from "../models/rcModel";
import httpStatus  from "http-status";
import { studentModel } from "../models/studentModel";

export const createSummerVacationForm= async (data:NewSummerVacation)=>
{
    return await db.insert(summerVacationModel).values(data).returning();
}

//get all student summer vacation forms
export const getAllSummerVacationForms = async (rollNo:string) =>
{   
    return await db.select()
    .from(summerVacationModel)
    .where(eq(summerVacationModel.roll_number,rollNo));
}

//put the corresponding summer vacation form by RC
export const approveSummerVacationFormByRC = async(summer_vacation_id:number,user_id:number,approve:boolean,comment?:string)=>
{

  await db.update(summerVacationModel)
  .set({ status: approve ? approval_status.rc : approval_status.declined})
  .where(
    eq(summerVacationModel.id,summer_vacation_id)
  );

  await db.insert(summerVacationApprovalsModel)
  .values(
    {
      summer_vacation_id:summer_vacation_id,
      user_id:user_id,
      approve:approve,
      ...(comment && { comment }),
    }
  );
}

//get all summer vacation forms waiting for approval from deputy Warden
export const getSummerVacationFormsForDeputyWarden = async() =>
{
  return await db
          .select()
          .from(summerVacationModel)
          .where(
          eq(summerVacationModel.status,approval_status.rc)
          );
}

//approve summer vacation form by Deputy Warden
export const approveSummerVacationByDeputyWarden = async (user_id:number,summer_vacation_id:number)=>
{
      await db
            .update(summerVacationModel)
            .set({status:approval_status.deputyWarden})
            .where(
              eq(summerVacationModel.id,summer_vacation_id)
            );

      await db.insert(summerVacationApprovalsModel).values(
        {
          summer_vacation_id:summer_vacation_id,
          user_id:Number(user_id),
          approve:true,
        }
      );
}

//get all summer vacation forms waiting for approval by RC
export const getSummerVacationFormsForRC = async (rc_id:number) =>
{
   
  //get the corresponding RC
  const rc= await db.select()
        .from(rcModel)
        .where(eq(rcModel.id,rc_id));

  if(rc.length === 0)
  {
    throw AppError("No Such RC Exists",httpStatus.BAD_REQUEST);
  }

  const rcFloor=rc[0].floor;
  const rcHostel=rc[0].hostel;

  //getting students from corresponding hostel and floor
  const students = await db.
  select(
    {
      rollNo:studentModel.rollNo,
      studFloor:studentModel.floor,
      hostel:studentModel.hostelBlock
    }
  )
  .from(studentModel)
  .where(and
    (
      inArray(studentModel.floor,rcFloor),
      eq(studentModel.hostelBlock,rcHostel)  
));

  if(students.length === 0)
  {
    throw AppError("There is no students in the floor and hostel",httpStatus.BAD_REQUEST);
  }


  //get all the matching roll nos in that floor and hostel
  const matchingRolls = students
    .filter((s) => rcFloor.includes(s.studFloor))
    .map((s) => s.rollNo);

    
    //fetch all the summer vacation forms by that rc
    return await db
    .select()
    .from(summerVacationModel)
    .where(and(inArray(summerVacationModel.roll_number, matchingRolls),
      eq(summerVacationModel.status,approval_status.manager)  
    ));

}


