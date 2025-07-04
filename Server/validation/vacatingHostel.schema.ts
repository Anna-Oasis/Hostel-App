import { z } from "zod";
import { endeavour } from "../constants/enum";

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
    }),

  future_address: z.string().min(1, "Future address is required"),

  returned_items: z.array(z.string()).optional(),

  endeavour: z.string().min(1, "Endeavour is required"),

  endeavourDescription: z.string().min(1, "Endeavour description is required"),

  feedback: z.string().min(1, "Feedback is required"),
});
