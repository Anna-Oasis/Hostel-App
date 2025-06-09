import {
  pgTable,
  serial,
  varchar,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { studentModel } from "./studentModel";
import { approval_status_pgEnum, approval_status } from "./enum";

export const newAdmissionModel = pgTable("admission", {
  id: serial("id").primaryKey(),

  // Foreign key to student roll number
  roll_number: varchar("roll_number", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "cascade" }),

  academicYear: varchar("academic_year", { length: 9 }).notNull(), // e.g., "2024-2025"

  declaration: boolean("declaration").notNull(),

  transaction_id: varchar("transaction_id", { length: 100 }).notNull(),

  status: approval_status_pgEnum("status")
    .notNull()
    .default(approval_status.submitted),
});

export type Admission = typeof newAdmissionModel.$inferSelect;
export type NewAdmission = typeof newAdmissionModel.$inferInsert;