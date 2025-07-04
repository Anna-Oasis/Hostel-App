import { z } from "zod";

export const rcDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dept: z.string().min(1, "Department is required"),
  registerNo: z.string().min(1, "Register number is required"),
  dob: z.coerce.date({ invalid_type_error: "Invalid date format" }),
  mobile: z.string().min(10).max(15),
  email: z.string().email(),
  guardianName: z.string().min(1, "Guardian name is required"),
  residentialAddress: z.string().min(1, "Residential address is required"),
  bloodGroup: z.string().min(1),
  medicalHistory: z.string().default(""),

  passportPhotoUrl: z.string().url().optional(),
  rcSignatureUrl: z.string().url().optional(),
});

export type RCDetailsInput = z.infer<typeof rcDetailsSchema>;
