import { z } from "zod";

export const createAttendanceSchema = z.object({
  date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),

  hostel: z.string()
    .min(1, "Hostel name is required")
    .max(50, "Hostel name must not exceed 50 characters")
    .trim(),

  floor: z.number()
    .int("Floor must be an integer")
    .min(0, "Floor must be 0 or positive")
    .max(20, "Floor must not exceed 20"),

  no_present: z.number()
    .int("Number of present students must be an integer")
    .min(0, "Number of present students cannot be negative"),

  no_absent: z.number()
    .int("Number of absent students must be an integer")
    .min(0, "Number of absent students cannot be negative"),

  absentee: z.array(z.string()
    .min(1, "Roll number cannot be empty")
    .max(20, "Roll number must not exceed 20 characters")
    .regex(/^[A-Za-z0-9]+$/, "Roll number must contain only alphanumeric characters")
  )
    .default([])
});
// .refine((data) => {
//   // Validate that absentee count matches no_absent
//   return data.absentee.length === data.no_absent;
// }, {
//   message: "Number of absentee roll numbers must match the absent count",
//   path: ["absentee"]
// })
// .refine((data) => {
//   // Validate that no_present + no_absent makes sense
//   return data.no_present >= 0 && data.no_absent >= 0;
// }, {
//   message: "Present and absent counts must be valid",
//   path: ["no_present", "no_absent"]
// })
// .refine((data) => {
//   // Check for duplicate roll numbers in absentee list
//   const uniqueRollNumbers = new Set(data.absentee);
//   return uniqueRollNumbers.size === data.absentee.length;
// }, {
//   message: "Duplicate roll numbers found in absentee list",
//   path: ["absentee"]
// });
// Type exports for TypeScript
