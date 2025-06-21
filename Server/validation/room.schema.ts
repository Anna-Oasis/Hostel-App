import z from "zod";
import { hostel_block } from "../constants/enum";

export const fetchRoomsSchema = z.object(
    {
        hostelBlock: z
            .enum(Object.values(hostel_block) as [string, ...string[]])
            .refine((val) => val !== "", { message: "Hostel block is required" }),
        academicYear: z
            .string()
            .min(9, "Academic year is required")
            .regex(/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"),
    }
);