import { z } from "zod";

export const wardenDecisionSchema = z.object({
  approve: z.boolean(),
  comment: z.string().optional(),
  room: z.coerce.number({ invalid_type_error: "room must be a number" }).optional(),
  floor: z.coerce.number({ invalid_type_error: "floor must be a number" }).optional(),
});

