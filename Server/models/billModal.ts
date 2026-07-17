import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const billInfoModel = pgTable("bill_info", {
  id: serial("id").primaryKey(),
  rollNumber: varchar("roll_no", { length: 30 }).notNull(),
  billId: varchar("bill_id", { length: 30 }).notNull(),
});

export type billInfo = typeof billInfoModel.$inferSelect;
export type newBillInfo = typeof billInfoModel.$inferInsert;
