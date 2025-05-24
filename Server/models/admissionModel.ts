import {pgTable, serial, varchar, integer, boolean, date, text, jsonb} from 'drizzle-orm/pg-core';
import{approval_status} from './approvalStatus';

export const admissionModel = pgTable('admission', {
    user_id: serial('user_id').primaryKey(),
    approval: approval_status('approval').notNull(),
    academic_year: varchar('academic_year', { length: 4 }).notNull(),
    payment_id: serial('payment_id').notNull(),

    //FORM DETAILS
    // Student Details
    name: varchar("name", { length: 100 }).notNull(),
    rollNo: varchar("roll_no", { length: 20 }).notNull(),
    course: varchar("course", { length: 50 }).notNull(),
    branch: varchar("branch", { length: 50 }).notNull(),
    semester: varchar("semester", { length: 10 }).notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    age: integer("age").notNull(),
    mobile: varchar("mobile", { length: 15 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    admissionCategory: varchar("admission_category", { length: 20 }).notNull(),
    bloodGroup: varchar("blood_group", { length: 10 }).notNull(),
    medicalHistory: text("medical_history").notNull(),
    previousResident: boolean("previous_resident").notNull(),

    // Parent Details
    fatherName: varchar("father_name", { length: 100 }).notNull(),
    fatherContactLocal: varchar("father_contact_local", { length: 15 }).notNull(),
    fatherContactForeign: varchar("father_contact_foreign", { length: 15 }),
    motherName: varchar("mother_name", { length: 100 }).notNull(),
    motherContactLocal: varchar("mother_contact_local", { length: 15 }).notNull(),
    landline: varchar("landline", { length: 15 }),
    parentEmail: varchar("parent_email", { length: 100 }).notNull(),
    occupation: varchar("occupation", { length: 100 }).notNull(),
    residentialAddress: text("residential_address").notNull(),
    pin: varchar("pin", { length: 10 }).notNull(),

    // Local Guardian
    guardianName: varchar("guardian_name", { length: 100 }),
    guardianOccupation: varchar("guardian_occupation", { length: 100 }),
    guardianResidentialAddress: text("guardian_residential_address"),
    guardianPin: varchar("guardian_pin", { length: 10 }),
    guardianMobile: varchar("guardian_mobile", { length: 15 }),
    guardianLandline: varchar("guardian_landline", { length: 15 }),
    guardianEmail: varchar("guardian_email", { length: 100 }),

    // Hostel Mess Declaration
    hostelBlock: varchar("hostel_block", { length: 20 }).notNull(),
    roomNumber: varchar("room_number", { length: 10 }).notNull(),
    messPreference: varchar("mess_preference", { length: 20 }).notNull(),
    declaration: jsonb("declaration").notNull(), 

    // Images
    passportPhoto: text("passport_photo").notNull(),
    studentSignature: text("student_signature").notNull(),
    parentGuardianSignature: text("parent_guardian_signature").notNull(),
});

export type Admission = typeof admissionModel.$inferSelect;
export type NewAdmission = typeof admissionModel.$inferInsert;
