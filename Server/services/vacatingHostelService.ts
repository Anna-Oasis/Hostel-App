import { eq, inArray, and} from "drizzle-orm";
import { db } from "../config/dbConnection";
import { vacatingHostelApprovalStatus } from "../constants/enum";
import {
  vacatingHostelModel,
  NewVacatingHostel,
} from "../models/vacatingHostel";
import { vacatingHostelApprovalsModel } from "../models/vacatingHostelApprovals";
import { cautionDepositRefundModel } from "../models/cautionDepositRefund";
import { rcModel } from "../models/rcModel";
import { studentModel } from "../models/studentModel";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
export const createVacatingHostelForm = async (formData: NewVacatingHostel) => {
  return await db.insert(vacatingHostelModel).values(formData).returning();
};
export const createCautionDepositRefund = async (data: any) => {
  const {
    vacating_hostel_id,
    accountHolderName,
    accountNumber,
    bankName,
    addressOfTheBank,
    IFSCode,
  } = data;

  return await db
    .insert(cautionDepositRefundModel)
    .values({
      vacating_hostel_id,
      accountHolderName,
      accountNumber,
      bankName,
      addressOfTheBank,
      IFSCode,
      deductions: "0.00", // add default values explicitly
      refund_amount: "0.00",
    })
    .returning();
};

export const getVacatingHostelFormsOfStudent = async (rollNo:string) => {
  return await db
    .select({
      vacating: vacatingHostelModel,
      caution: cautionDepositRefundModel,
    })
    .from(vacatingHostelModel)
    .where(eq(vacatingHostelModel.roll_number, rollNo))
    .leftJoin(
      cautionDepositRefundModel,
      eq(cautionDepositRefundModel.vacating_hostel_id, vacatingHostelModel.id)
    );
};

export const getPendingRCApprovals = async (rcUserId: number) => {
  const [rc] = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.userId, rcUserId));

  if (!rc || !rc.floor) throw AppError("RC not found", httpStatus.FORBIDDEN);

  if(!rc.floor) throw AppError("RC floor information is missing or invalid", httpStatus.BAD_REQUEST);

  if (!rc.floor) {
    throw AppError("RC floor information is missing", httpStatus.BAD_REQUEST);
  }
  return await db
    .select({
      vacating: vacatingHostelModel,
      student: studentModel,
    })
    .from(vacatingHostelModel)
    .innerJoin(
      studentModel,
      eq(vacatingHostelModel.roll_number, studentModel.rollNo)
    )
    .where(
      and(
        eq(vacatingHostelModel.status, vacatingHostelApprovalStatus.SUBMITTED),

        eq(studentModel.hostelBlock, rc.hostel),
        inArray(studentModel.floor, rc.floor)
      )
    );
};

export const approveOrDeclineByRC = async (
  vacating_hostel_id: number,
  rcUserId: number,
  approve: boolean,
  comment?: string
) => {
  // 1. Get RC details
  const [rc] = await db
    .select()
    .from(rcModel)
    .where(eq(rcModel.userId, rcUserId));

  if (!rc || !rc.floor) {
    throw AppError("RC not found", httpStatus.FORBIDDEN);
  }

  // 2. Get Vacating Form
  const [form] = await db
    .select({ roll_number: vacatingHostelModel.roll_number })
    .from(vacatingHostelModel)
    .where(eq(vacatingHostelModel.id, vacating_hostel_id));

  if (!form) {
    throw AppError("Vacating hostel form not found", httpStatus.NOT_FOUND);
  }

  // 3. Get Student Info
  const [student] = await db
    .select({
      hostelBlock: studentModel.hostelBlock,
      floor: studentModel.floor,
    })
    .from(studentModel)
    .where(eq(studentModel.rollNo, form.roll_number));

  if (!student) {
    throw AppError("Student not found", httpStatus.NOT_FOUND);
  }

  // 4. Check permission
  console.log(rc.hostel, student.hostelBlock, rc.floor, student.floor);
  const isHostelMatch = rc.hostel === student.hostelBlock;
  if (student.floor === undefined || student.floor === null) {
    throw AppError(
      "Student floor information is missing",
      httpStatus.BAD_REQUEST
    );
  }
  if (!rc.floor || !Array.isArray(rc.floor)) {
    throw AppError("RC floor information is missing or invalid", httpStatus.BAD_REQUEST);
  }

  const isFloorMatch = rc.floor.includes(student.floor);

  if (!isHostelMatch || !isFloorMatch) {
    throw AppError("RC not authorized for this student", httpStatus.FORBIDDEN);
  }

  // 5. Insert into approvals table
  await db.insert(vacatingHostelApprovalsModel).values({
    vacating_hostel_id,
    user_id: rcUserId,
    approve,
    comment,
  });

  // 6. Update status in vacating_hostel
  const newStatus = approve ? vacatingHostelApprovalStatus.RC : vacatingHostelApprovalStatus.DECLINED;
  const [updatedForm] = await db
    .update(vacatingHostelModel)
    .set({ status: newStatus })
    .where(eq(vacatingHostelModel.id, vacating_hostel_id))
    .returning();

  return {
    message: approve ? "Approved by RC" : "Declined by RC",
    updatedForm: updatedForm,
  };
};

export const getVacatingFormsWaitingForManager = async () => {
  // First get all vacating forms approved by RC
  const approvedForms = await db
    .select({ id: vacatingHostelModel.id })
    .from(vacatingHostelModel)
    .where(eq(vacatingHostelModel.status, vacatingHostelApprovalStatus.RC));

  if (approvedForms.length === 0) {
    return [];
  }

  // Extract the IDs
  const approvedFormIds = approvedForms.map((form) => form.id);

  // Get only caution deposit refund data for these IDs
  const cautionDepositData = await db
    .select()
    .from(cautionDepositRefundModel)
    .where(
      inArray(cautionDepositRefundModel.vacating_hostel_id, approvedFormIds)
    );

  return cautionDepositData;
};

export const getVacatingFormsWaitingForDeputyWarden = async () => {
  return await db
    .select()
    .from(vacatingHostelModel)
    .where(eq(vacatingHostelModel.status, vacatingHostelApprovalStatus.MANAGER));
};

/*
This can be used to get all vacating forms approved by RC along with caution deposit refund data
export const getVacatingFormsApprovedByRC = async () => {
  // First get all vacating forms approved by RC
  const approvedForms = await db
    .select({ id: vacatingHostelModel.id })
    .from(vacatingHostelModel)
    .where(eq(vacatingHostelModel.status, approval_status.rc));

  if (approvedForms.length === 0) {
    return [];
  }

  // Extract the IDs
  const approvedFormIds = approvedForms.map(form => form.id);

  // Get caution deposit refund data for these IDs
  const cautionDepositData = await db
    .select({
      // Caution deposit refund data
      vacating_hostel_id: cautionDepositRefundModel.vacating_hostel_id,
      deductions: cautionDepositRefundModel.deductions,
      refund_amount: cautionDepositRefundModel.refund_amount,
      deduction_details: cautionDepositRefundModel.deduction_details,
      refund_timestamp: cautionDepositRefundModel.timestamp,
      
      // Vacating hostel data
      id: vacatingHostelModel.id,
      roll_number: vacatingHostelModel.roll_number,
      vacating_date: vacatingHostelModel.vacating_date,
      vacating_time: vacatingHostelModel.vacating_time,
      future_address: vacatingHostelModel.future_address,
      returned_items: vacatingHostelModel.returned_items,
      status: vacatingHostelModel.status,
      created_at: vacatingHostelModel.created_at,
      updated_at: vacatingHostelModel.updated_at,
    })
    .from(cautionDepositRefundModel)
    .innerJoin(
      vacatingHostelModel, 
      eq(cautionDepositRefundModel.vacating_hostel_id, vacatingHostelModel.id)
    )
    .where(inArray(cautionDepositRefundModel.vacating_hostel_id, approvedFormIds));

  return cautionDepositData;
};
*/

export const approveOrDeclineByManager = async (
  vacating_hostel_id: number,
  managerId: number,
  approve: boolean,
  comment?: string,
  cautionDepositData?: {
    deductions: string;
    refund_amount: string;
    deduction_details?: string;
  }
) => {
  // First update only the provided fields in caution deposit refund
  if (cautionDepositData) {
    const updateData: any = {};

    if (cautionDepositData.deductions !== undefined) {
      updateData.deductions = cautionDepositData.deductions;
    }

    if (cautionDepositData.refund_amount !== undefined) {
      updateData.refund_amount = cautionDepositData.refund_amount;
    }

    if (cautionDepositData.deduction_details !== undefined) {
      updateData.deduction_details = cautionDepositData.deduction_details;
    }

    // Always update timestamp when making changes
    updateData.timestamp = new Date();

    await db
      .update(cautionDepositRefundModel)
      .set(updateData)
      .where(
        eq(cautionDepositRefundModel.vacating_hostel_id, vacating_hostel_id)
      );
  }

  // Create entry in vacating hostel approvals
  await db.insert(vacatingHostelApprovalsModel).values({
    vacating_hostel_id,
    user_id: managerId,
    approve,
    comment: comment || null,
  });

  // Determine new status based on approval
  const newStatus = approve
    ? vacatingHostelApprovalStatus.MANAGER
    : vacatingHostelApprovalStatus.DECLINED;

  // Update vacating hostel model status
  const updatedForm = await db
    .update(vacatingHostelModel)
    .set({
      status: newStatus,
      updated_at: new Date(),
    })
    .where(eq(vacatingHostelModel.id, vacating_hostel_id))
    .returning();

  return {
    message: approve ? "Approved by Manager" : "Declined by Manager",
    updatedForm: updatedForm[0],
  };
};
export const approveOrDeclineByDeputyWarden = async (
  vacating_hostel_id: number,
  deputyWardenId: number,
  approve: boolean,
  comment?: string
) => {
  // Create entry in vacating hostel approvals with optional comment
  await db.insert(vacatingHostelApprovalsModel).values({
    vacating_hostel_id,
    user_id: deputyWardenId,
    approve,
    comment: comment || null,
  });

  // Determine new status based on approval
  const newStatus = approve
    ? vacatingHostelApprovalStatus.DEPUTYWARDEN
    : vacatingHostelApprovalStatus.DECLINED;

  // Update vacating hostel model status
  const updatedForm = await db
    .update(vacatingHostelModel)
    .set({
      status: newStatus,
      updated_at: new Date(),
    })
    .where(eq(vacatingHostelModel.id, vacating_hostel_id))
    .returning();

  return {
    message: approve
      ? "Approved by Deputy Warden"
      : "Declined by Deputy Warden",
    updatedForm: updatedForm[0],
  };
};
