import { z } from "zod";
import { hostelBlock } from "../constants/enum";

export const rcAdmissionDecisionSchema = z.object({
  approve: z.boolean(),
  comment: z.string().optional(),
  room: z.coerce.number({ invalid_type_error: "room must be a number" }).optional(),
  floor: z.coerce.number({ invalid_type_error: "floor must be a number" }).optional(),
  hostel_block: z
    .enum(Object.values(hostelBlock) as [string, ...string[]]).optional(),
});

export const rcCreateSchema = z.object({
  name: z.string().min(1, "RC name is required"),
  email :z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  hostel: z.nativeEnum(hostelBlock, {
    errorMap: () => ({ message: "Invalid hostel block" }),
  }),
  floor : z.array(z.number()).default([]).optional(),
});

export const rcUpdateSchema = z.object({
  name: z.string().min(1, "RC name is required").optional(),
  hostel: z.nativeEnum(hostelBlock, {
    errorMap: () => ({ message: "Invalid hostel block" }),
  }).optional(),
  floor: z.array(z.number()).default([]).optional(),
});