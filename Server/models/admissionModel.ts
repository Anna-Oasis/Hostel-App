import {
  pgTable,
  varchar,
  boolean,
  date,
  serial,
} from "drizzle-orm/pg-core";
import { approval_status_pgEnum, messPreferenceEnum} from "./enum";
import { studentModel } from "./studentModel";

export const admissionModel = pgTable("admission", {
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

  // Category
  admissionCategory: varchar("category", {length: 25}).notNull(),

  // Readmission
  previousResident: boolean("previous_resident").notNull(),

  // Mess preference
  messPreference: messPreferenceEnum("mess_preference").notNull(),

  // Block assignment
  hostelBlock: varchar("hostel_block", {length: 50}),

  // Payment
  transactionId: varchar("transaction_id", { length: 100 }).notNull(),
});

export type Admission = typeof admissionModel.$inferSelect;
export type NewAdmission = typeof admissionModel.$inferInsert;
export type AdmissionUpdate = Partial<NewAdmission> & { admissionId: number };
export type AdmissionWithUser = Admission & { user: { name: string; email: string } };