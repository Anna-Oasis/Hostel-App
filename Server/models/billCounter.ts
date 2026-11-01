import { pgTable, serial, integer } from "drizzle-orm/pg-core";
import { admissionSessionModel } from "./admissionSession";

export const billCounterModel = pgTable("bill_counter", {
  id: serial("id").primaryKey(),
  session_id : integer("session_id").references(() => admissionSessionModel.id).default(1),
  lastBillId: integer("last_bill_id").notNull(),
});