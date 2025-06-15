import {
  pgTable,
  serial,
  varchar,
  boolean,
  integer,
  date,
  time,
  timestamp,
} from "drizzle-orm/pg-core";
import { studentModel } from "./studentModel";
import { approval_status_pgEnum} from "./enum";
import { approval_status } from "../constants/enum";

export const admissionModel = pgTable("admission", {
  id: serial("id").primaryKey(),

  // Foreign key to student roll number
  roll_number: varchar("roll_number", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "cascade" }),

  academicYear: varchar("academic_year", { length: 9 }).notNull(), 

  studentAgreed: boolean("student_agreed").notNull(),
  parentAgreed: boolean("parent_agreed").notNull(),

  admissionCategory: varchar("admission_category", { length: 20 }).notNull(),
  // Hostel/Mess Info
  previousResident: boolean("previous_resident").notNull(),
  hostelBlock: varchar("hostel_block", { length: 20 }).notNull(),
  roomNumber: varchar("room_number", { length: 10 }).notNull(),
  messPreference: varchar("mess_preference", { length: 20 }).notNull(),

  submission_Date: timestamp("submission_date",{withTimezone:true}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at",{withTimezone:true}).defaultNow().notNull(),

  transaction_id: varchar("transaction_id", { length: 100 }).notNull(),

  status: approval_status_pgEnum("status")
    .notNull()
    .default(approval_status.submitted),
});

export type Admission = typeof admissionModel.$inferSelect;
export type NewAdmission = typeof admissionModel.$inferInsert;
