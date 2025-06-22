import { leaveFormModel, NewLeaveForm } from "../models/leaveForm";
import { studentModel } from "../models/studentModel";
import { db } from "../config/dbConnection";
import { eq, and, inArray } from "drizzle-orm";
import { approval_status } from "../constants/enum";
import { leaveFormApprovalsModel } from "../models/leaveFormApprovals";

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

export const getLeaveFormsToBeApprovedByRcByFloor = async (floor: number[], hostel_block: string) => {
  const leave_form = await db
    .select()
    .from(leaveFormModel)
    .innerJoin(studentModel, eq(leaveFormModel.roll_number, studentModel.rollNo))
    .where(
    and(
        inArray(studentModel.floor, floor),
        eq(leaveFormModel.status, approval_status.submitted),
        eq(studentModel.hostelBlock, hostel_block)
    ))
    .orderBy(leaveFormModel.created_at);
  return leave_form;
};

export const getLeaveFormsToBeApprovedByDeputyWarden = async () => {
  const leave_form = await db
    .select()
    .from(leaveFormModel)
    .innerJoin(studentModel, eq(leaveFormModel.roll_number, studentModel.rollNo))
    .where(
      eq(leaveFormModel.status, approval_status.rc)
    )
    .orderBy(leaveFormModel.created_at);
  return leave_form;
};

export const getLeaveFormByLeaveFormId = async (leave_form_id: number) => {
  const leave_form = await db
    .select()
    .from(leaveFormModel)
    .where(eq(leaveFormModel.id, leave_form_id));
  return leave_form;
};

export const updateLeaveForm = async (
    leave_form_id: number,
    updatedData: Partial<NewLeaveForm>
 ) => {
  const leave_form = await db
    .update(leaveFormModel)
    .set(updatedData)
    .where(eq(leaveFormModel.id, leave_form_id))
    .returning({
      leave_form_id: leaveFormModel.id,
      status: leaveFormModel.status,
      updatedAt: leaveFormModel.updated_at,
    });
};

export async function createLeaveFormApproval(approvalData: {
  leave_form_id: number;
  user_id: number;
  approve: boolean;
  comment?: string | null;
}) {
  // Check if record already exists
  const existingApproval = await db
    .select()
    .from(leaveFormApprovalsModel)
    .where(
      and(
        eq(leaveFormApprovalsModel.leave_form_id, approvalData.leave_form_id),
        eq(leaveFormApprovalsModel.user_id, approvalData.user_id)
      )
    );

  if (existingApproval.length > 0) {
    // Update existing record
    const result = await db
      .update(leaveFormApprovalsModel)
      .set({
        approve: approvalData.approve,
        comment: approvalData.comment || null,
        timestamp: new Date(), // Update timestamp
      })
      .where(
        and(
          eq(leaveFormApprovalsModel.leave_form_id, approvalData.leave_form_id),
          eq(leaveFormApprovalsModel.user_id, approvalData.user_id)
        )
      )
      .returning();
    return result;
  } else {
    // Insert new record
    const result = await db
      .insert(leaveFormApprovalsModel)
      .values({
        leave_form_id: approvalData.leave_form_id,
        user_id: approvalData.user_id,
        approve: approvalData.approve,
        comment: approvalData.comment || null,
      })
      .returning();
    return result;
  }
}
