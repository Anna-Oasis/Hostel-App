import {
  pgTable,
  serial,
  integer,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { admissionModel } from "./admissionModel";
import { userModel } from "./userModel";

export const admissionApprovalsModel = pgTable("admission_approvals", {
  //id: serial("id").primaryKey(),

  // Foreign key to admission
  admission_id: integer("admission_id")
    .notNull()
    .references(() => admissionModel.id, { onDelete: "cascade" }),

  // Foreign key to users
  user_id: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "no action" }),

  approve: boolean("approve").notNull(),

  comment: text("comment"), // Optional field

  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AdmissionApproval = typeof admissionApprovalsModel.$inferSelect;
export type NewAdmissionApproval = typeof admissionApprovalsModel.$inferInsert;