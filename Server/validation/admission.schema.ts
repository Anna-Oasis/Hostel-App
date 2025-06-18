import { z } from "zod";
import { hostel_block } from "../constants/enum";

export const createAdmissionSchema = z.object({
  roll_number: z.string().min(6, "Roll number is required"),
  academicYear: z
    .string()
    .min(9, "Academic year is required")
    .regex(/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"),
  studentAgreed: z.boolean().refine((val) => val === true, {
    message: "Student must agree to the terms",
  }),
  parentAgreed: z.boolean().refine((val) => val === true, {
    message: "Parent must agree to the terms",
  }),
  admissionCategory: z
    .string()
    .min(1, "Admission category is required")
    .max(30, "Admission category must be less than 30 characters"),
  previousResident: z.boolean(),

  hostelBlock: z
    .enum(Object.values(hostel_block) as [string, ...string[]])
    .refine((val) => val !== "", { message: "Hostel block is required" }),
    
  messPreference: z
    .string()
    .min(1, "Mess preference is required")
    .max(20, "Mess preference must be less than 20 characters"),
  transaction_id: z
    .string()
    .min(1, "Transaction ID is required")
    .max(100, "Transaction ID must be less than 100 characters"),
});
