import { z } from "zod";

// Regex for YYYY-MM-DD format (vacation_from)
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const summerVacationSchema = z.object({
  roll_number: z.string()
    .min(1, "Roll number is required")
    .max(20, "Roll number too long"),

  vacation_from: z.string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid ISO timestamp for vacation_time"
    })
    .transform((val) => new Date(val)), 

  address_of_stay: z.string()
    .min(3, "Address is too short")
    .max(100, "Address too long"),

  mobile: z.string().regex(/^(\+\d{1,3})?\d{10}$/, "Invalid mobile number"),
  email: z.string().email(),
  declarartion_id: z.number(),
  returned_items: z.array(z.string().max(100)).optional().default([]),
});
