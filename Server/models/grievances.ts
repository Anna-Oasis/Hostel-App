import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { studentModel } from "./studentModel";
import { grievance_status_pgEnum } from "./enum";
import { grievanceApprovalStatus } from "../constants/enum";

export const grievancesModel = pgTable("grievances", {
  id: serial("id").primaryKey(),

  // Foreign key to student roll number
  roll_number: varchar("roll_number", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "cascade" }),

  // Grievance form details
  grievance_type: varchar("grievance_type", { length: 50 }).notNull(), // e.g., "Mess", "Hostel", "Administration"
  subject: varchar("subject", { length: 200 }).notNull(),
  description: text("description").notNull(),
  
  // Approval and resolution status
  status: grievance_status_pgEnum("status")
    .notNull()
    .default(grievanceApprovalStatus.SUBMITTED),

  // Timestamps
  rc_decision_at: timestamp("rc_approval_at"),
  resolved_at: timestamp("resolved_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export type Grievance = typeof grievancesModel.$inferSelect;
export type NewGrievance = typeof grievancesModel.$inferInsert;