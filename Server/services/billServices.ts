import { eq } from "drizzle-orm";
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

// Get the bill counter
export const getBillCounter = async () => {
  const result = await db
    .select()
    .from(billCounterModel)
    .limit(1);

  if (result.length > 0) {
    return result[0];
  }

  const created = await db
    .insert(billCounterModel)
    .values({
      lastBillId: 0,
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
    .set({ lastBillId })
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

// Get existing bill or create a new one
export const getOrCreateBillId = async (rollNo: string) => {
  const existingBill = await getBillByRollNo(rollNo);

  if (existingBill) {
    return existingBill.billId;
  }

  const counter = await getBillCounter();

  if (!counter) {
    throw new Error("Bill counter not initialized.");
  }

  const nextBillNumber = (counter.lastBillId ?? 0) + 1;
  const newBillId = nextBillNumber.toString().padStart(4, "0");

  await updateBillCounter(counter.id, nextBillNumber);
  await createBill(rollNo, newBillId);

  return newBillId;
};