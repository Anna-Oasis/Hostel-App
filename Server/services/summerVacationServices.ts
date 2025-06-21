import express, { Request, Response } from "express";
import {
  summerVacationModel,
  NewSummerVacation,
} from "../models/summerVacation";
import { db } from "../config/dbConnection";
import { eq, and, inArray, or, isNull } from "drizzle-orm";
import { summerVacationApprovalsModel } from "../models/summerVacationApprovals";
import { summer_vacation_status, hostel_block } from "../constants/enum";
import { JWTPayload } from "../types/roles";
import AppError from "../utils/AppError";
import { rcModel } from "../models/rcModel";
import httpStatus from "http-status";
import { studentModel } from "../models/studentModel";

export const createSummerVacationForm = async (data: NewSummerVacation) => {
  return await db.insert(summerVacationModel).values(data).returning();
};

//get all student summer vacation forms
export const getAllSummerVacationForms = async (rollNo: string) => {
  return await db
    .select()
    .from(summerVacationModel)
    .where(eq(summerVacationModel.roll_number, rollNo));
};

export const getAllSummerVacationFormsWithStudentDetailsFilterByBlockAndFloor =
  async (hostelBlock: string, floors: number[]) => {
    return await db
      .select({
        id: summerVacationModel.id,
        floor: studentModel.floor,
        block: studentModel.hostelBlock,
        room_number: studentModel.roomNumber,
        roll_number: summerVacationModel.roll_number,
        vacation_from: summerVacationModel.vacation_from,
        address_of_stay: summerVacationModel.address_of_stay,
        returned_items: summerVacationModel.returned_items,
        status: summerVacationModel.status,
        created_at: summerVacationModel.created_at,
        updated_at: summerVacationModel.updated_at,
        student_name: studentModel.name,
      })
      .from(summerVacationModel)
      .innerJoin(
        studentModel,
        eq(summerVacationModel.roll_number, studentModel.rollNo)
      )
      .where(
        and(
          eq(studentModel.hostelBlock, hostelBlock),
          floors.length === 0
            ? undefined
            : or(
                isNull(studentModel.floor),
                inArray(studentModel.floor, floors)
              )
        )
      );
  };

//put the corresponding summer vacation form by RC
export const approveSummerVacationFormByRC = async (
  summer_vacation_id: number,
  user_id: number,
  approve: boolean,
  comment?: string
) => {
  await db
    .update(summerVacationModel)
    .set({
      status: approve
        ? summer_vacation_status.rc
        : summer_vacation_status.declined,
    })
    .where(eq(summerVacationModel.id, summer_vacation_id));

  await db.insert(summerVacationApprovalsModel).values({
    summer_vacation_id: summer_vacation_id,
    user_id: user_id,
    approve: approve,
    ...(comment && { comment }),
  });
};

//get all summer vacation forms waiting for approval from deputy Warden
export const getSummerVacationFormsForDeputyWarden = async () => {
  return await db
    .select()
    .from(summerVacationModel)
    .where(eq(summerVacationModel.status, summer_vacation_status.rc));
};

//approve summer vacation form by Deputy Warden
export const approveSummerVacationByDeputyWarden = async (
  user_id: number,
  summer_vacation_id: number,
  approve: boolean,
  comment?: string
) => {
  await db
    .update(summerVacationModel)
    .set({
      status: approve
        ? summer_vacation_status.deputyWarden
        : summer_vacation_status.declined,
    })
    .where(eq(summerVacationModel.id, summer_vacation_id));

  await db.insert(summerVacationApprovalsModel).values({
    summer_vacation_id: summer_vacation_id,
    user_id: user_id,
    approve: approve,
    ...(comment && { comment }),
  });
};
