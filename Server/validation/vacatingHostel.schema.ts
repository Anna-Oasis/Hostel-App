import { z } from "zod";

export const vacatingFormSchema = z.object({
  roll_number: z.string().min(1, "Roll number is required"),

  vacating_date: z.coerce.date({
    required_error: "Vacating date is required",
    invalid_type_error: "Vacating date must be a valid date",
  }),

  vacating_time: z
    .string({
      required_error: "Vacating time is required",
      invalid_type_error: "Vacating time must be a string in HH:mm:ss format",
    })
    .regex(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
      message: "Vacating time must be in HH:mm:ss format",
    }),

  future_address: z.string().min(1, "Future address is required"),

  returned_items: z.array(z.string()).optional(),
});
