import { pgEnum } from "drizzle-orm/pg-core";
import {
  approval_status,
  hostel_block,
  gender,
  user_role,
  rcLeave_status,
  summer_vacation_status
} from "../constants/enum";

export const approval_status_pgEnum = pgEnum(
  "approval_status",
  Object.values(approval_status) as [string, ...string[]]
);

export const summer_vacation_status_pgEnum = pgEnum(
  "summer_vacation_status",
  Object.values(summer_vacation_status) as [string, ...string[]]
);


export const rcLeave_status_pgEnum = pgEnum(
  "rcLeave_status",
  Object.values(rcLeave_status) as [string, ...string[]]
);

export const hostel_block_pgEnum = pgEnum(
  "hostel_block",
  Object.values(hostel_block) as [string, ...string[]]
);

export const gender_pgEnum = pgEnum(
  "gender",
  Object.values(gender) as [string, ...string[]]  
);

export const user_role_pgEnum = pgEnum(
  "role",
  Object.values(user_role) as [string, ...string[]]
);
