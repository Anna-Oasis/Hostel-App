import { z } from "zod";
import { hostelBlock } from "../constants/enum";


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