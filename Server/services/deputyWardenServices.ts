import { eq, and } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { admissionModel } from "../models/admissionModel";
import { admissionApprovalsModel } from "../models/admissionApprovals";
import { studentModel } from "../models/studentModel";
import { roomModel } from "../models/roomModel";
import { approval_status } from "../constants/enum";
import { getRollNumberByAdmissionId, getAdmissionByAdmissionId } from "./admissionServices";

export const getAdmissionsByDeputyWarden = async () => {
  return await db
    .select()
    .from(admissionModel)
    .innerJoin(studentModel, eq(admissionModel.roll_number, studentModel.rollNo))
    .where(eq(admissionModel.status, approval_status.rc));
};

