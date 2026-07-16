import { z } from "zod";
import { hostelBlock } from "../constants/enum";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const MAX_REPORT_DAYS = 45;

const isValidDateString = (value: string) => {
  if (!datePattern.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const getInclusiveDayCount = (fromDate: string, toDate: string) => {
  const from = new Date(`${fromDate}T00:00:00.000Z`);
  const to = new Date(`${toDate}T00:00:00.000Z`);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.floor((to.getTime() - from.getTime()) / millisecondsPerDay) + 1;
};

export const managerAttendanceReportSchema = z
  .object({
    fromDate: z
      .string()
      .refine(isValidDateString, "fromDate must be a valid date in YYYY-MM-DD format"),

    toDate: z
      .string()
      .refine(isValidDateString, "toDate must be a valid date in YYYY-MM-DD format"),

    admissionSessionId: z.coerce
      .number()
      .int("admissionSessionId must be an integer")
      .positive("admissionSessionId must be positive"),

    hostelBlock: z.enum(Object.values(hostelBlock) as [string, ...string[]]),
  })
  .refine((data) => data.fromDate <= data.toDate, {
    message: "fromDate must be before or equal to toDate",
    path: ["fromDate"],
  })
  .refine((data) => getInclusiveDayCount(data.fromDate, data.toDate) <= MAX_REPORT_DAYS, {
    message: `Date range must not exceed ${MAX_REPORT_DAYS} days`,
    path: ["toDate"],
  });

export type ManagerAttendanceReportInput = z.infer<
  typeof managerAttendanceReportSchema
>;

