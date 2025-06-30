import { z } from "zod";

export const createAdmissionSessionSchema = z.object({
    from: z.string().date("Invalid date format for 'from'"),
    to: z.string().date("Invalid date format for 'to'"),
    semesters: z.array(z.number().int()).min(1, "At least one semester required"),
    academic_year: z.string().min(4).max(9),
});

export type CreateAdmissionSessionInput = z.infer<typeof createAdmissionSessionSchema>;
