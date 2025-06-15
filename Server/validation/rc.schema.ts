import { z } from "zod";
import { grievancesModel } from "../models/grievances";

export const rcAdmissionDecisionSchema = z.object({
  rc_id: z.coerce.number({ invalid_type_error: "rc_id must be a number" }),
  approve: z.boolean(),
  comment: z.string().optional(),
  room: z.string().min(1, "Room is required"),
  floor: z.coerce.number({ invalid_type_error: "floor must be a number" }),
  student_user_id: z.coerce.number({ invalid_type_error: "student_user_id must be a number" }),
});

export const rcGrievanceDecisionSchema = z.object({
  approve: z.boolean(),
  grievances_id: z.coerce.number({ invalid_type_error: "grievance_id must be a number" }),
});

