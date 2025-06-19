import { z } from "zod";
import { grievancesModel } from "../models/grievances";
import { hostel_block } from "../constants/enum";

export const rcAdmissionDecisionSchema = z.object({
  approve: z.boolean(),
  comment: z.string().optional(),
  room: z.coerce.number({ invalid_type_error: "room must be a number" }).optional(),
  floor: z.coerce.number({ invalid_type_error: "floor must be a number" }).optional(),
  hostel_block: z.enum(["Flora", "Lavender"]).optional(),
});

export const rcGrievanceDecisionSchema = z.object({
  approve: z.boolean(),
  grievances_id: z.coerce.number({ invalid_type_error: "grievance_id must be a number" }),
});
