import { NewRCLeave } from "../models/rcLeave";
import { db } from "../config/dbConnection";
import { eq, and } from "drizzle-orm";
import { rcLeaveModel } from "../models/rcLeave";
import { rcLeaveApprovalStatus } from "../constants/enum";
import { rcModel } from "../models/rcModel";

export const getRCLeaveApprovals = async (rcId: number) => {
    return await db
        .select({
            Id: rcLeaveModel.id,
            rcId: rcLeaveModel.rc_id,
            leaving: rcLeaveModel.leaving,
            arrival: rcLeaveModel.arrival,
            reason: rcLeaveModel.reason,
            approved: rcLeaveModel.approved,
            comment : rcLeaveModel.comment,
            createdAt: rcLeaveModel.created_at,
            dwApprovedAt: rcLeaveModel.dw_approved_at,
            ewUpdatedAt: rcLeaveModel.ew_updated_at,
        })
        .from(rcLeaveModel)
        .where(eq(rcLeaveModel.rc_id, rcId));
};

export const createRcLeaveForm = async( data:NewRCLeave)=> {

    return await db.insert(rcLeaveModel).values(data).returning();
}

export async function updateRCLeave(
  leaveId: number,
  data: {
    arrival?: string;
    reason?: string;
  }
) {
  const [updatedLeave] = await db
    .update(rcLeaveModel)
    .set({
      ...data,
      approved : rcLeaveApprovalStatus.SUBMITTED,
      ew_updated_at: new Date(),
    })
    .where(eq(rcLeaveModel.id, leaveId))
    .returning();

  if (!updatedLeave) {
    throw new Error("RC leave not found");
  }

  return updatedLeave;
}
/**
 * 
 * @param rcId Id of the RC who is going on Leave
 * @param id Id of the AlterNate RC 
 * @returns 
 */
export async function updateAlternateRCtoId(rcId : number,id : number) {
  const updateRC = await db.update(rcModel)
      .set({
        alternatingToRCId : rcId
      })
      .where(eq(rcModel.id, id))
      .returning();
  return updateRC;
}

/**
 * 
 * @param rcId Id of the RC who went on the Leave
 * @returns rcModel[] 
 */
export async function updateAlternateRCtoNull(rcId : number) {
  const updatedRC = await db.update(rcModel)
      .set({
        alternatingToRCId : null
      })
      .where(eq(rcModel.alternatingToRCId, rcId))
      .returning();
  return updatedRC;
}

export async function updateRCLeaveStatus(leaveId : number, status : string, comment ?: string) {
    const updatedLeave = await db.update(rcLeaveModel)
        .set({
          approved: status,
          comment : comment ?? ""
        })
        .where(eq(rcLeaveModel.id, leaveId))
        .returning();
    return updatedLeave;
}

export const getRCLeaveToBeApprovedByDeputyWarden = async (block : string) => {
  const leave_form = await db
    .select({
      leave: rcLeaveModel,
      rc: rcModel,
    })
    .from(rcLeaveModel)
    .innerJoin(
      rcModel,
      eq(rcLeaveModel.rc_id, rcModel.id)
    )
    .where(
      and(
        eq(rcLeaveModel.approved, rcLeaveApprovalStatus.RC),
        eq(rcModel.hostel, block)
      ))
    .orderBy(rcLeaveModel.created_at);
  return leave_form;
};

export const getRCLeaveToBeApprovedByExecutiveWarden = async () => {
  const leave_form = await db
    .select({
      leave: rcLeaveModel,
      rc: rcModel,
    })
    .from(rcLeaveModel)
    .innerJoin(
      rcModel,
      eq(rcLeaveModel.rc_id, rcModel.id)
    )
    .where(
      and(
        eq(rcLeaveModel.approved, rcLeaveApprovalStatus.DEPUTYWARDEN)
      ))
    .orderBy(rcLeaveModel.created_at);
  return leave_form;
};

export const getRCLeaveToBeApprovedByAlternateRC = async () => {
  const leave_form = await db
    .select({
      leave: rcLeaveModel,
      rc: rcModel,
    })
    .from(rcLeaveModel)
    .innerJoin(
      rcModel,
      eq(rcLeaveModel.rc_id, rcModel.id)
    )
    .where(
      and(
        eq(rcLeaveModel.approved, rcLeaveApprovalStatus.SUBMITTED)
      ))
    .orderBy(rcLeaveModel.created_at);
  return leave_form;
};