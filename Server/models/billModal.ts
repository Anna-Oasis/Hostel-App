import { integer } from "drizzle-orm/pg-core";
import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { admissionModel } from "./admissionModel";
import { feePayment } from "./feePaymentModel";

export const billInfoModel = pgTable("bill_info", {
  id: serial("id").primaryKey(),
  rollNumber: varchar("roll_no", { length: 30 }).notNull(),
  billId: varchar("bill_id", { length: 30 }).notNull(),
  admissionId : integer("admission_id").references(() => admissionModel.id),
  feePaymentId : integer("fee_payment_id").references(() => feePayment.id)
});

export type billInfo = typeof billInfoModel.$inferSelect;
export type newBillInfo = typeof billInfoModel.$inferInsert;
