import {
  pgTable,
  serial,
  integer,
  date,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { rcModel } from "./rcModel";
import { rcLeaveApprovalStatus } from "../constants/enum";
import { rcLeave_status_pgEnum } from "./enum";
import { userModel } from "./userModel";

export const rcLeaveModel = pgTable("rc_leave", {
  id: serial("id").primaryKey(),

  // Foreign key to RC
  rc_id: integer("rc_id")
    .notNull()
    .references(() => rcModel.userId, { onDelete: "cascade" }),

  leaving: date("leaving").notNull(),
  arrival: date("arrival").notNull(),
  
  reason: text("reason").notNull(),

  approved: rcLeave_status_pgEnum("approved").default(rcLeaveApprovalStatus.SUBMITTED).notNull(),
   //Timestamps
  created_at: timestamp("created_at").defaultNow().notNull(),
  dw_approved_at: timestamp("approved_at").defaultNow(),
  ew_updated_at: timestamp("updated_at").defaultNow(),
});

export type RCLeave = typeof rcLeaveModel.$inferSelect;
export type NewRCLeave = typeof rcLeaveModel.$inferInsert;