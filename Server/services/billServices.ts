import { eq, and } from "drizzle-orm";
import { db } from "../config/dbConnection";
import { billInfo, newBillInfo, billInfoModel } from "../models/billModal";
import { billCounterModel } from "../models/billCounter";


// Get bill by roll number
export const getBillByRollNo = async (rollNo: string) => {
  const result = await db
    .select()
    .from(billInfoModel)
    .where(eq(billInfoModel.rollNumber, rollNo))
    .limit(1);

  return result[0] ?? null;
};

export const getBillByRollNoByAdmissionId = async (rollNo: string, admissionId : number) => {
  const result = await db
    .select()
    .from(billInfoModel)
    .where(
      and(
        eq(billInfoModel.rollNumber, rollNo),
        eq(billInfoModel.admissionId, admissionId)
      )
    )
    .limit(1);

  return result[0] ?? null;
};

export const getBillByRollNoByFeePaymentId = async (rollNo: string, feePaymentId : number) => {
  const result = await db
    .select()
    .from(billInfoModel)
    .where(
      and(
        eq(billInfoModel.rollNumber, rollNo),
        eq(billInfoModel.feePaymentId, feePaymentId)
      )
    )
    .limit(1);

  return result[0] ?? null;
};
// Get the bill counter
export const getBillCounter = async (sessionId : number) => {
  const result = await db
    .select()
    .from(billCounterModel)
    .where(
      eq(billCounterModel.session_id, sessionId)
    )
    .limit(1);

  if (result.length > 0) {
    return result[0];
  }

  const created = await db
    .insert(billCounterModel)
    .values({
      lastBillId: 0,
      session_id : sessionId
    })
    .returning();

  return created[0];
};

// Update the bill counter
export const updateBillCounter = async (
  counterId: number,
  lastBillId: number
) => {
  await db
    .update(billCounterModel)
    .set({ lastBillId : lastBillId })
    .where(eq(billCounterModel.id, counterId));
};

// Create a bill record
export const createBill = async (
  rollNo: string,
  billId: string
) => {
  return await db
    .insert(billInfoModel)
    .values({
      rollNumber: rollNo,
      billId,
    })
    .returning();
};

export const createBillWithAdmissionId = async (
  rollNo: string,
  billId: string,
  admissionId : number
) => {
  return await db
    .insert(billInfoModel)
    .values({
      rollNumber: rollNo,
      billId : billId,
      admissionId : admissionId
    })
};

export const createBillWithFeePaymentId = async (
  rollNo: string,
  billId: string,
  feePaymentId : number
) => {
  return await db
    .insert(billInfoModel)
    .values({
      rollNumber: rollNo,
      billId : billId,
      feePaymentId : feePaymentId
    })
};

// Get existing bill or create a new one
// export const getOrCreateBillId = async (rollNo: string) => {
//   const existingBill = await getBillByRollNo(rollNo);

//   if (existingBill) {
//     return existingBill.billId;
//   }

//   const counter = await getBillCounter();

//   if (!counter) {
//     throw new Error("Bill counter not initialized.");
//   }

//   const nextBillNumber = (counter.lastBillId ?? 0) + 1;
//   const newBillId = nextBillNumber.toString().padStart(4, "0");

//   await updateBillCounter(counter.id, nextBillNumber);
//   await createBill(rollNo, newBillId);

//   return newBillId;
// };

export const getOrCreateBillIdByAdmissionId = async (rollNo: string, sessionId : number, admissionId : number) => {
  const existingBill = await getBillByRollNoByAdmissionId(rollNo, admissionId);

  if (existingBill) {
    return existingBill.billId;
  }

  const counter = await getBillCounter(sessionId);

  if (!counter) {
    throw new Error("Bill counter not initialized.");
  }

  const nextBillNumber = (counter.lastBillId ?? 0) + 1;
  const newBillId = nextBillNumber.toString().padStart(4, "0");

  await updateBillCounter(counter.id, nextBillNumber);
  await createBillWithAdmissionId(rollNo, newBillId, admissionId);

  return newBillId;
};

export const getOrCreateBillIdByFeePaymentId = async (rollNo: string, sessionId : number, feePaymentId : number) => {
  const existingBill = await getBillByRollNoByFeePaymentId(rollNo, feePaymentId);

  if (existingBill) {
    return existingBill.billId;
  }

  const counter = await getBillCounter(sessionId);

  if (!counter) {
    throw new Error("Bill counter not initialized.");
  }

  const nextBillNumber = (counter.lastBillId ?? 0) + 1;
  const newBillId = nextBillNumber.toString().padStart(4, "0");

  await updateBillCounter(counter.id, nextBillNumber);
  await createBillWithFeePaymentId(rollNo, newBillId, feePaymentId);

  return newBillId;
};