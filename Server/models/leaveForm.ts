import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { studentModel } from "./studentModel";
import { approval_status_pgEnum, approval_status } from "./enum";

export const leaveFormModel = pgTable("leave_form", {
  id: serial("id").primaryKey(),

  // Foreign key to student roll number
  roll_number: varchar("roll_number", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "cascade" }),

  // Leave form details
  leave_type: varchar("leave_type", { length: 50 }).notNull(), // e.g., "Medical", "Personal", "Emergency"
  from_date: date("from_date").notNull(),
  to_date: date("to_date").notNull(),
  reason: text("reason").notNull(),
  destination: varchar("destination", { length: 100 }).notNull(),
  emergency_contact: varchar("emergency_contact", { length: 15 }).notNull(),
  
  // Status and timestamps
  status: approval_status_pgEnum("status")
    .notNull()
    .default(approval_status.submitted),
    
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type LeaveForm = typeof leaveFormModel.$inferSelect;
export type NewLeaveForm = typeof leaveFormModel.$inferInsert;