import { z } from "zod";

export const deputyWardenDecisionSchema = z.object({
  student_user_id: z.coerce.number({ invalid_type_error: "student user_id must be a number" }),
  approve: z.boolean(),
  comment: z.string().optional(),
  room: z.coerce.number({ invalid_type_error: "room must be a number" }),
  floor: z.coerce.number({ invalid_type_error: "floor must be a number" }),
});

