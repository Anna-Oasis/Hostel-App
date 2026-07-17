import { pgTable, serial, integer } from "drizzle-orm/pg-core";

export const billCounterModel = pgTable("bill_counter", {
  id: serial("id").primaryKey(),
  lastBillId: integer("last_bill_id").notNull(),
});