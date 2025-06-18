import { z } from "zod";

export const vacatingFormSchema = z.object({
  roll_number: z.string().min(1, "Roll number is required"),

  // Parse date string to Date
  vacating_date: z.coerce.date({
    required_error: "Vacating date is required",
    invalid_type_error: "Vacating date must be a valid date",
  }),

  // Parse timestamp string to Date (ISO format)
  vacating_time: z.coerce.date({
    required_error: "Vacating time is required",
    invalid_type_error: "Vacating time must be a valid timestamp",
  }),

  future_address: z.string().min(1, "Future address is required"),

  // Optional or required based on your logic
  returned_items: z.array(z.string()).optional(),
});
