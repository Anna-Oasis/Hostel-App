import {z} from "zod";

export const LeaveDecisionSchema = z.object({
  approve: z.boolean(),
  comment: z.string().optional(),
});