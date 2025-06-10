import {
  pgTable,
  serial,
  integer,
  decimal,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { vacatingHostelModel } from "./vacatingHostel";

export const cautionDepositRefundModel = pgTable("caution_deposit_refund", {
 // id: serial("id").primaryKey(),

  // Foreign key to vacating hostel
  vacating_hostel_id: integer("vacating_hostel_id")
    .notNull()
    .unique()
    .references(() => vacatingHostelModel.id, { onDelete: "cascade" }),

  deductions: decimal("deductions", { precision: 10, scale: 2 }).default("0.00").notNull(),

  refund_amount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),

  deduction_details: text("deduction_details"), // Optional field to explain deductions

  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type CautionDepositRefund = typeof cautionDepositRefundModel.$inferSelect;
export type NewCautionDepositRefund = typeof cautionDepositRefundModel.$inferInsert;