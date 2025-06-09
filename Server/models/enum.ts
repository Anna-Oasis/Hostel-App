import { pgEnum } from "drizzle-orm/pg-core";

/*
0 - Student submission
1 - RC
2 - Manager
3 - Deputy Warden
4 - Executive Warden
*/

export const approval_status = {
  submitted: "0",
  manager: "1",
  rc: "2",
  deputyWarden: "3",
  executiveWarden: "4",
  declined:"-1,"
} as const;

export type ApprovalStatus =
  (typeof approval_status)[keyof typeof approval_status];

export const approval_status_pgEnum = pgEnum(
  "approval_status",
  approval_status
);

export const GENDER = pgEnum("gender", ["Male", "Female", "Other", "Prefer not to say"]);

export const user_role = pgEnum("role", [
  "STUDENT",
  "MANAGER",
  "RC",
  "DEPUTY_WARDEN",
  "EXECUTIVE_WARDEN",
]);
