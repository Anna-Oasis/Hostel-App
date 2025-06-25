import { pgEnum } from "drizzle-orm/pg-core";
import {
  hostelBlock,
  gender,
  userRole,
  admissionApprovalStatus,
  rcLeaveApprovalStatus,
  grievanceApprovalStatus,
  summerVacationApprovalStatus,
  studentLeaveApprovalStatus,
  vacatingHostelApprovalStatus,
  endeavour
} from "../constants/enum";

export const admission_approval_status_pgEnum = pgEnum(
  "approval_status",
  Object.values(admissionApprovalStatus) as [string, ...string[]]
);

export const summer_vacation_status_pgEnum = pgEnum(
  "summer_vacation_status",
  Object.values(summerVacationApprovalStatus) as [string, ...string[]]
);

export const rcLeave_status_pgEnum = pgEnum(
  "rcLeave_status",
  Object.values(rcLeaveApprovalStatus) as [string, ...string[]]
);

export const hostel_block_pgEnum = pgEnum(
  "hostel_block",
  Object.values(hostelBlock) as [string, ...string[]]
);

export const gender_pgEnum = pgEnum(
  "gender",
  Object.values(gender) as [string, ...string[]]
);


export const user_role_pgEnum = pgEnum(
  "role",
  Object.values(userRole) as [string, ...string[]]
);

export const endeavour_pgEnum = pgEnum(
  "endeavour",
  Object.values(endeavour) as [string, ...string[]]
);

export const grievance_status_pgEnum = pgEnum(
  "grievance_status",
  Object.values(grievanceApprovalStatus) as [string, ...string[]]
);

export const student_leave_status_pgEnum = pgEnum(
  "student_leave_status",
  Object.values(studentLeaveApprovalStatus) as [string, ...string[]]
);

export const vacating_hostel_status_pgEnum = pgEnum(
  "vacating_hostel_status",
  Object.values(vacatingHostelApprovalStatus) as [string, ...string[]]
);


