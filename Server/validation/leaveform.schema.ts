import { z } from "zod";

export const leaveFormSchema = z.object({
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
  mobile: z.string().regex(/^(\+\d{1,3})?\d{10}$/, "Invalid mobile number"),
  email: z.string().email(),
  emergency_contact: z.string().regex(/^(\+\d{1,3})?\d{10}$/, "Invalid emergency contact"),
});

export const LeaveDecisionSchema = z.object({
  approve: z.boolean(),
  comment: z.string().optional(),
});