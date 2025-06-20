import {
  pgTable,
  serial,
  integer,
  decimal,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { vacatingHostelModel } from "./vacatingHostel";

export const cautionDepositRefundModel = pgTable("caution_deposit_refund", {
  // Foreign key to vacating hostel
  vacating_hostel_id: integer("vacating_hostel_id")
    .notNull()
    .unique()
    .references(() => vacatingHostelModel.id, { onDelete: "cascade" }),

  deductions: decimal("deductions", { precision: 10, scale: 2 }).default("0.00").notNull(),

  deduction_details: text("deduction_details"),
  
  refund_amount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),

  accountHolderName: varchar("account_holder_name", { length: 100 }).notNull(),

  accountNumber: varchar("account_number", { length: 20 }).notNull(),

  bankName: varchar("bank_name", { length: 100 }).notNull(),

  addressOfTheBank: text("address_of_the_bank").notNull(),

  IFSCode: varchar("ifsc_code", { length: 11 }).notNull(),

  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type CautionDepositRefund = typeof cautionDepositRefundModel.$inferSelect;
export type NewCautionDepositRefund = typeof cautionDepositRefundModel.$inferInsert;