import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { studentModel } from "./studentModel";

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
  rc_approval: boolean("rc_approval").default(false).notNull(),
  resolved: boolean("resolved").default(false).notNull(),
  
  // Timestamps
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type Grievance = typeof grievancesModel.$inferSelect;
export type NewGrievance = typeof grievancesModel.$inferInsert;