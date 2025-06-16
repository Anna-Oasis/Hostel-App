import { db } from "../config/dbConnection";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { admissionModel } from "../models/admissionModel";
import { eq, and, or } from "drizzle-orm";
import { approval_status } from "../constants/enum";
import { rcModel } from "../models/rcModel";

export const getAdmissionsApprovedByRC = async (rcId: number) => {
  return await db
    .select({
      approval: admissionApprovalsModel.approve,
      comment: admissionApprovalsModel.comment,
      timestamp: admissionApprovalsModel.timestamp,
      admissionId: admissionApprovalsModel.admission_id,
      status: admissionModel.status,
      // roomNumber: admissionModel.roomNumber,
      hostelBlock: admissionModel.hostelBlock,
      rollNumber: admissionModel.roll_number,
    })
    .from(admissionApprovalsModel)
    .innerJoin(admissionModel, eq(admissionModel.id, admissionApprovalsModel.admission_id))
    .where(
      and(
        eq(admissionApprovalsModel.user_id, rcId),
        or(
          eq(admissionModel.status, approval_status.rc),
          eq(admissionModel.status, approval_status.declined)
        )
      )
    );
};
export const rcExists = async (rcId: number) => {
  const rc = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.id, rcId))
    .limit(1);

  return rc;
}