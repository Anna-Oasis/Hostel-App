import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { grievancesModel } from "../models/grievances";
import { eq, and } from "drizzle-orm";

export const getAdmissionApprovals = async (userId: number) => {
  return await db
    .select({
      admissionId: admissionModel.id,
      rollNumber: admissionModel.roll_number,
      academicYear: admissionModel.academicYear,
      status: admissionModel.status,
      approved: admissionApprovalsModel.approve,
      comment: admissionApprovalsModel.comment,
      timestamp: admissionApprovalsModel.timestamp,
    })
    .from(admissionApprovalsModel)
    .innerJoin(
      admissionModel,
      eq(admissionApprovalsModel.admission_id, admissionModel.id)
    )
    .where(
      and(
        eq(admissionApprovalsModel.user_id, userId),
        eq(admissionApprovalsModel.approve, true)
      )
    );
};


