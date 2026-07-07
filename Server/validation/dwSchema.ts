import { z } from "zod";
import { hostelBlock } from "../constants/enum";

export const deputyWardenCreateSchema = z.object({
  name: z.string().min(1, "Deputy Warden name is required"),

  email: z.string().email("Invalid email format"),

  block: z
    .nativeEnum(hostelBlock, {
      errorMap: () => ({ message: "Invalid hostel block" }),
    }),

  dept: z.string().min(1, "Department is required"),

  passportPhotoUrl: z.string().url("Invalid photo URL").optional(),
});

export const deputyWardenUpdateSchema = z.object({
  name: z.string().min(1, "Deputy Warden name is required").optional(),

  email: z.string().email("Invalid email format").optional(),

  block: z
    .nativeEnum(hostelBlock, {
      errorMap: () => ({ message: "Invalid hostel block" }),
    }).optional(),

  dept: z.string().min(1, "Department is required").optional(),

  passportPhotoUrl: z.string().url("Invalid photo URL").optional(),
});