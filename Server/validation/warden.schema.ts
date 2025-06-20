import { z } from "zod";

export const wardenDecisionSchema = z.object({
  approve: z.boolean(),
  comment: z.string().optional(),
});


