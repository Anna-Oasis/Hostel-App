import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { grievancesModel } from "../models/grievances";
import { eq, and } from "drizzle-orm";

export class ManagerService {
  async getAdmissionApprovals(userId: number) {
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
  }

  async resolveGrievance(grievanceId: number) {
    return await db
      .update(grievancesModel)
      .set({ resolved: true })
      .where(eq(grievancesModel.id, grievanceId))
      .returning();
  }

  async getGrievances() {
    return await db
      .select({
        greivanceId: grievancesModel.id,
        rollNo: grievancesModel.roll_number,
        formDetails: {
          grievanceType: grievancesModel.grievance_type,
          subject: grievancesModel.subject,
          description: grievancesModel.description,
          priority: grievancesModel.priority,
        },
        resolved: grievancesModel.resolved,
      })
      .from(grievancesModel)
      .where(eq(grievancesModel.rc_approval, true));
  }
} 