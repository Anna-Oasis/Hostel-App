import { z } from "zod";

export const leaveFormSchema = z.object({
  roll_number: z.string().min(1, "Roll number is required"),
  leave_type: z.string().min(1, "Leave type is required"),
  from_date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    "Invalid from_date"
  ),
  to_date: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    "Invalid to_date"
  ),
  reason: z.string().min(1, "Reason is required"),
  address_of_stay: z.string().min(1, "Address of stay is required"),
  emergency_contact: z
    .string()
    .min(10, "Emergency contact should be at least 10 digits")
    .max(15, "Emergency contact too long"),
});
