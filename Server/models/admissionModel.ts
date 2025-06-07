import {
  pgTable,
  varchar,
  boolean,
  date,
  serial,
} from "drizzle-orm/pg-core";
import { approval_status_pgEnum } from "./enum";
import { studentModel } from "./studentModel";

export const admissionModel = pgTable("Admissionn", {
  // Student Reference
  admissionId: serial("admission_id").primaryKey(),
  rollNo: varchar("roll_no", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "no action" }),

  //Academic year
  academicYear: varchar("academic_year", { length: 15 }).notNull(),

  // System Fields
  approval: approval_status_pgEnum("approval").notNull(),

  // Declaration
  studentDeclaration: boolean("student_declaration").notNull(),
  parentDeclaration: boolean("parent_declaration").notNull(),

  // Timestamp
  createdAt: date("created_at").defaultNow().notNull(),

  // Payment
  transactionId: varchar("transaction_id", { length: 100 }).notNull(),
});

export type Admission = typeof admissionModel.$inferSelect;
export type NewAdmission = typeof admissionModel.$inferInsert;
export type AdmissionUpdate = Partial<NewAdmission> & { admissionId: number };
export type AdmissionWithUser = Admission & { user: { name: string; email: string } };
