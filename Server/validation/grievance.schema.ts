import { z } from "zod";

export const createGrievanceSchema = z.object({
  grievance_type: z.string().min(2, "Grievance type is required").max(50, "Grievancve type  must be less than 50 characters"),
  subject: z.string().min(2, "Grievance subject is required").max(200, "Grievancve subject  must be less than 200 characters"),
  description: z.string().min(2, "Grievance description is required")
});

export const rcGrievanceDecisionSchema = z.object({
  approve: z.boolean(),
  //grievances_id: z.coerce.number({ invalid_type_error: "grievance_id must be a number" }),
});