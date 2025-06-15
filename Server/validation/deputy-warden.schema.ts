import { z } from "zod";

export const deputyWardenDecisionSchema = z.object({
  user_id: z.coerce.number({ invalid_type_error: "student user_id must be a number" }),
  approve: z.boolean(),
  comment: z.string().optional(),
  room: z.string().min(1, "Room is required"),
  floor: z.coerce.number({ invalid_type_error: "floor must be a number" }),
});

