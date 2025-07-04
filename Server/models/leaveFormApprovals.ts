import {
  pgTable,
  serial,
  integer,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { leaveFormModel } from "./leaveForm";
import { userModel } from "./userModel";

export const leaveFormApprovalsModel = pgTable("leave_form_approvals", {
  //id: serial("id").primaryKey(),

  // Foreign key to leave form
  leave_form_id: integer("leave_form_id")
    .notNull()
    .references(() => leaveFormModel.id, { onDelete: "cascade" }),

  // Foreign key to users
  user_id: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "no action" }),

  approve: boolean("approve").notNull(),

  comment: text("comment"), // Optional field

  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type LeaveFormApproval = typeof leaveFormApprovalsModel.$inferSelect;
export type NewLeaveFormApproval = typeof leaveFormApprovalsModel.$inferInsert;