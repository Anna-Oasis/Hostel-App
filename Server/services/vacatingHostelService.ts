import { eq, inArray } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { approval_status } from "../constants/enum";
import { vacatingHostelModel, NewVacatingHostel } from "../models/vacatingHostel";
import { vacatingHostelApprovalsModel } from "../models/vacatingHostelApprovals";
import { cautionDepositRefundModel } from "../models/cautionDepositRefund";

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
      deductions: "0.00",        // add default values explicitly
      refund_amount: "0.00",
    })
    .returning();
};

export const getAllVacatingHostelForms = async () => {
  return await db.select().from(vacatingHostelModel);
};


export const getPendingRCApprovals = async (rcId: number) => {
  return await db
    .select()
    .from(vacatingHostelModel)
    .where(eq(vacatingHostelModel.status, approval_status.manager))
    // .where(eq(vacatingHostelModel.rc_id, rcId));  //No particular field for RC ID in the model, ONLY if the rcID is present we can fetch the pending requests
                                                     //of that particular RC
};

export const approveOrDeclineByRC = async (
  vacating_hostel_id: number,
  rcId: number,
  approve: boolean
) => {
  await db.insert(vacatingHostelApprovalsModel).values({
    vacating_hostel_id,
    user_id: rcId,
    approve,
  });

  const newStatus = approve ? approval_status.rc : approval_status.declined;
  await db
    .update(vacatingHostelModel)
    .set({ status: newStatus })
    .where(eq(vacatingHostelModel.id, vacating_hostel_id));

  return { message: approve ? "Approved by RC" : "Declined by RC" };
};

export const getVacatingFormsWaitingForManager = async () => {
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

  // Get only caution deposit refund data for these IDs
  const cautionDepositData = await db
    .select()
    .from(cautionDepositRefundModel)
    .where(inArray(cautionDepositRefundModel.vacating_hostel_id, approvedFormIds));

  return cautionDepositData;
};

export const getVacatingFormsWaitingForDeputyWarden = async () => {
  return await db
    .select()
    .from(vacatingHostelModel)
    .where(eq(vacatingHostelModel.status, approval_status.manager));
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
      .where(eq(cautionDepositRefundModel.vacating_hostel_id, vacating_hostel_id));
  }

  // Create entry in vacating hostel approvals
  await db.insert(vacatingHostelApprovalsModel).values({
    vacating_hostel_id,
    user_id: managerId,
    approve,
    comment: comment || null,
  });

  // Determine new status based on approval
  const newStatus = approve ? approval_status.deputyWarden : approval_status.declined;
  
  // Update vacating hostel model status
  const updatedForm = await db
    .update(vacatingHostelModel)
    .set({ 
      status: newStatus,
      updated_at: new Date()
    })
    .where(eq(vacatingHostelModel.id, vacating_hostel_id))
    .returning();

  return { 
    message: approve ? "Approved by Manager" : "Declined by Manager",
    updatedForm: updatedForm[0]
  };
};