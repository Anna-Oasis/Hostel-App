import { z } from "zod";

export const managerAdmissionDecisionSchema = z.object({
  user_id: z.coerce.number({ invalid_type_error: "manager_user_id must be a number" }),
  approve: z.boolean(),
  comment: z.string().optional(),
});