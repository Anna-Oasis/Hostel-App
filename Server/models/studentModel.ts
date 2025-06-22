import {
  pgTable,
  varchar,
  integer,
  boolean,
  date,
  text,
} from "drizzle-orm/pg-core";
import { userModel } from "./userModel";
import {gender_pgEnum, hostel_block_pgEnum} from "./enum";
import { hostel_block } from "../constants/enum";

export const studentModel = pgTable("student", {
  // User Reference
  user_id: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "no action" }).unique(),

  //hostel
  roomNumber : integer("room_number"),
  floor: integer("floor"),
  hostelBlock: hostel_block_pgEnum("hostel_block"),
  
  // Student Details
  name: varchar("name", { length: 100 }).notNull(),
  rollNo: varchar("roll_no", { length: 20 }).primaryKey(),
  course: varchar("course", { length: 50 }).notNull(),
  branch: varchar("branch", { length: 50 }).notNull(),
  semester: varchar("semester", { length: 10 }).notNull(),
  mobile: varchar("mobile", { length: 15 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  emergencyContact: varchar("emergency_contact", { length: 15 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  age: integer("age").notNull(),
  gender: gender_pgEnum("gender").notNull(),
  nationality: varchar("nationality", { length: 50 }).notNull(),
  govtIdType: varchar("govt_id_type", { length: 50 }).notNull(),
  govtId: varchar("govt_id", { length: 50 }).notNull(),
  bloodGroup: varchar("blood_group", { length: 10 }).notNull(),
  medicalHistory: text("medical_history").notNull(),

  // Father Details
  fatherName: varchar("father_name", { length: 100 }).notNull(),
  fatherOccupation: varchar("father_occupation", { length: 100 }).notNull(),
  fatherMobile: varchar("father_mobile", { length: 15 }).notNull(),
  fatherEmail: varchar("father_email", { length: 100 }).notNull(),
  fatherCountry: varchar("father_country", { length: 50 }).notNull(),

  // Mother Details
  motherName: varchar("mother_name", { length: 100 }).notNull(),
  motherOccupation: varchar("mother_occupation", { length: 100 }).notNull(),
  motherMobile: varchar("mother_mobile", { length: 15 }).notNull(),
  motherEmail: varchar("mother_email", { length: 100 }).notNull(),
  motherCountry: varchar("mother_country", { length: 50 }).notNull(),

  // Residential Address - India (Flat fields)
  resIndiaHouseNo: varchar("res_india_house_no", { length: 100 }).notNull(),
  resIndiaStreet: varchar("res_india_street", { length: 100 }).notNull(),
  resIndiaCity: varchar("res_india_city", { length: 50 }).notNull(),
  resIndiaState: varchar("res_india_state", { length: 50 }).notNull(),
  resIndiaCountry: varchar("res_india_country", { length: 50 }).notNull(),
  resIndiaPostalCode: varchar("res_india_postal_code", {
    length: 20,
  }).notNull(),

  // Residential Address - Foreign (Optional Flat Fields)
  resForeignHouseNo: varchar("res_foreign_house_no", { length: 100 }),
  resForeignStreet: varchar("res_foreign_street", { length: 100 }),
  resForeignCity: varchar("res_foreign_city", { length: 50 }),
  resForeignState: varchar("res_foreign_state", { length: 50 }),
  resForeignCountry: varchar("res_foreign_country", { length: 50 }),
  resForeignPostalCode: varchar("res_foreign_postal_code", { length: 20 }),

  // Local Guardian Details (Flat)
  localGuardianName: varchar("local_guardian_name", { length: 100 }),
  localGuardianRelationship: varchar("local_guardian_relationship", {
    length: 50,
  }),
  localGuardianMobile: varchar("local_guardian_mobile", { length: 15 }),
  localGuardianEmail: varchar("local_guardian_email", { length: 100 }),

  guardianHouseNo: varchar("guardian_house_no", { length: 100 }),
  guardianStreet: varchar("guardian_street", { length: 100 }),
  guardianCity: varchar("guardian_city", { length: 50 }),
  guardianState: varchar("guardian_state", { length: 50 }),
  guardianCountry: varchar("guardian_country", { length: 50 }),
  guardianPostalCode: varchar("guardian_postal_code", { length: 20 }),

  // Timestamp
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt:date("updated_at").defaultNow().notNull(),

  // Images
  passportPhotoUrl: text("passport_photo_url"),
  studentSignatureUrl: text("student_signature_url"),
  parentGuardianSignatureUrl: text("parent_guardian_signature_url"),
  categoryProofUrl: text("category_proof_url"),
  admissionSlipUrl: text("admission_slip_url")
});

export type Student = typeof studentModel.$inferSelect;
export type NewStudent = typeof studentModel.$inferInsert;
export type StudentUpdate = Partial<NewStudent> & { rollNo: string };
