import { z } from "zod";
import { hostelBlock } from "../constants/enum";

export const createAdmissionSchema = z.object({
  roll_number: z.string().min(6, "Roll number is required"),
  academicYear: z
    .string()
    .min(9, "Academic year is required")
    .regex(/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"),

  studentAgreed: z.coerce.boolean().refine((val) => val === true, {
    message: "Student must agree to the terms",
  }),
  parentAgreed: z.coerce.boolean().refine((val) => val === true, {
    message: "Parent must agree to the terms",
  }),
  previousResident: z.coerce.boolean(),

  hostelBlock: z
    .enum(Object.values(hostelBlock) as [string, ...string[]])
    .refine((val) => val !== "", { message: "Hostel block is required" }),

  messPreference: z
    .string()
    .min(1, "Mess preference is required")
    .max(20, "Mess preference must be less than 20 characters"),

  transaction_id: z
    .string()
    .min(3, "Transaction ID is required")
    .max(100, "Transaction ID must be less than 100 characters"),

  transactionPhotoUrl: z.string().optional(),
});


export const roomAllocationSchema = z.object({
  room: z.coerce.number({ invalid_type_error: "room must be a number" }),
  floor: z.coerce.number({ invalid_type_error: "floor must be a number" }),
  hostel_block: z.enum(Object.values(hostelBlock) as [string, ...string[]]),
});

export const wardenDecisionSchema = z.object({
  approve: z.boolean(),
  comment: z.string().optional(),
});
