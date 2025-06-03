import {pgTable, serial, varchar, integer, boolean, date, text, jsonb} from 'drizzle-orm/pg-core';
import { approval_status_pgEnum } from './enum';

export const readmissionModel = pgTable('readmission', {
    user_id: serial('user_id').primaryKey(),
    approval: approval_status_pgEnum('approval').notNull(),
    academic_year: varchar('academic_year', { length: 4 }).notNull(),
    payment_id: serial('payment_id').notNull(),

    //FORM DETAILS
    // Student Details
    studentName: text("student_name").notNull(),
    course: varchar("course", { length: 10 }).notNull(),
    branch: varchar("branch", { length: 50 }).notNull(),
    year: varchar("year", { length: 2 }).notNull(),
    semester: varchar("semester", { length: 2 }).notNull(),
    studentMobile: varchar("student_mobile", { length: 15 }).notNull(),
    studentEmail: varchar("student_email", { length: 100 }).notNull(),

    // Parent Details
    parentMobile1: varchar("parent_mobile_1", { length: 15 }).notNull(),
    parentMobile2: varchar("parent_mobile_2", { length: 15 }),
    parentEmail: varchar("parent_email", { length: 100 }),

    // Local Guardian
    guardianName: text("guardian_name"),
    guardianMobile: varchar("guardian_mobile", { length: 15 }),

    // Address
    address: text("address").notNull(),

    // Hostel Details
    hostelBlock: varchar("hostel_block", { length: 50 }).notNull(),
    roomNumber: varchar("room_number", { length: 10 }).notNull(),
    keyReceived: boolean("key_received").notNull(),

    // Payment Details
    feesPaid: boolean("fees_paid").notNull(),
    transactionReferenceNo: varchar("transaction_reference_no", { length: 50 }),
    transactionDate: date("transaction_date"),
    amount: integer("amount"),
    anyDues: boolean("any_dues").notNull(),

    // Images (URLs in Supabase Storage)
    //studentPhotoUrl: text("student_photo_url").notNull(),
    //studentSignatureUrl: text("student_signature_url"),
    //parentGuardianSignatureUrl: text("parent_guardian_signature_url"),

    // Declaration
    studentAgreed: boolean("student_agreed").notNull(),
    parentAgreed: boolean("parent_agreed").notNull(),
    submissionDate: date("submission_date").notNull()
});

export type Readmission = typeof readmissionModel.$inferSelect;
export type NewReadmission = typeof readmissionModel.$inferInsert;

