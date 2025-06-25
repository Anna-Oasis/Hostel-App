import {
  pgTable,
  serial,
  varchar,
  boolean,
  integer,
  date,
  time,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { studentModel } from "./studentModel";
import { admission_approval_status_pgEnum, hostel_block_pgEnum} from "./enum";
import { admissionApprovalStatus } from "../constants/enum";
import { declarationModel } from "./declarationModel";


export const admissionModel = pgTable("admission", {
  id: serial("id").primaryKey(),

  declarartion_id: integer("declaration_id")
      .notNull()
      .references(() => declarationModel.id, { onDelete: "no action" }).unique(),

  // Foreign key to student roll number
  roll_number: varchar("roll_number", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "cascade" }),

  academicYear: varchar("academic_year", { length: 9 }).notNull(), 

  studentAgreed: boolean("student_agreed").notNull(),
  parentAgreed: boolean("parent_agreed").notNull(),

  
  // Hostel/Mess Info
  previousResident: boolean("previous_resident").notNull(),
  hostelBlock: hostel_block_pgEnum("hostel_block").notNull(),
  messPreference: varchar("mess_preference", { length: 20 }).notNull(),

  submission_Date: timestamp("submission_date",{withTimezone:true}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at",{withTimezone:true}).defaultNow().notNull(),

  transaction_id: varchar("transaction_id", { length: 100 }).notNull(),
  transactionPhotoUrl: text("transaction_photo_url"),

  status: admission_approval_status_pgEnum("status")
    .notNull()
    .default(admissionApprovalStatus.SUBMITTED),
});

export type Admission = typeof admissionModel.$inferSelect;
export type NewAdmission = typeof admissionModel.$inferInsert;
