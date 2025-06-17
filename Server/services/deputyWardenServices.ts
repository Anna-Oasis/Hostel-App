import { eq, and } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { studentModel } from "../models/studentModel";
import { roomModel } from "../models/roomModel";
import { approval_status } from "../constants/enum";
import { getRollNumberByAdmissionId, getAdmissionByAdmissionId } from "./admissionServices";
import { grievancesModel } from "../models/grievances";

export const getAdmissionsByDeputyWarden = async () => {
  return await db
    .select()
    .from(admissionModel)
    .innerJoin(studentModel, eq(admissionModel.roll_number, studentModel.rollNo))
    .where(eq(admissionModel.status, approval_status.rc));
};


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

export const getGreivances = async ()=>
{
    return db
        .select({
          greivanceId: grievancesModel.id,
          rollNo: grievancesModel.roll_number,
          formDetails: {
            grievanceType: grievancesModel.grievance_type,
            subject: grievancesModel.subject,
            description: grievancesModel.description,
            // priority: grievancesModel.priority,
          },
          resolved: grievancesModel.resolved,
        })
        .from(grievancesModel);
}

