import {
  summerVacationModel,
  NewSummerVacation,
} from "../models/summerVacation";
import { db } from "../config/dbConnection";
import { eq, and, inArray, or, isNull } from "drizzle-orm";
import { summerVacationApprovalsModel } from "../models/summerVacationApprovals";
import { summerVacationApprovalStatus } from "../constants/enum";
import { studentModel } from "../models/studentModel";
import { roomModel } from "../models/roomModel";

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
        ? summerVacationApprovalStatus.RC
        : summerVacationApprovalStatus.DECLINED,
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
    .where(eq(summerVacationModel.status, summerVacationApprovalStatus.RC));
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
        ? summerVacationApprovalStatus.DEPUTYWARDEN
        : summerVacationApprovalStatus.DECLINED,
    })
    .where(eq(summerVacationModel.id, summer_vacation_id));

  await db.insert(summerVacationApprovalsModel).values({
    summer_vacation_id,
    user_id,
    approve,
    ...(comment && { comment }),
  });

  // Step 3: Deallocate student room if approved
  if (approve) {
    // Get student's roll number
    const result = await db
      .select({
        rollNo: studentModel.rollNo,
      })
      .from(summerVacationModel)
      .innerJoin(
        studentModel,
        eq(summerVacationModel.roll_number, studentModel.rollNo)
      )
      .where(eq(summerVacationModel.id, summer_vacation_id));

    const studentRollNo = result[0]?.rollNo;

    if (!studentRollNo) {
      throw new Error("Student not found for summer vacation record");
    }

    // Set roomNumber, floor, hostelBlock to null for the student
    await db
      .update(studentModel)
      .set({
        roomNumber: null,
        floor: null,
        hostelBlock: null,
      })
      .where(eq(studentModel.rollNo, studentRollNo));
  }
};
