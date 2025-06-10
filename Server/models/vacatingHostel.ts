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

export const vacatingHostelModel = pgTable("vacating_hostel", {
  id: serial("id").primaryKey(),

  // Foreign key to student roll number
  roll_number: varchar("roll_number", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "cascade" }),

  // Vacating hostel form details
  reason_for_vacating: varchar("reason_for_vacating", { length: 100 }).notNull(),
  last_date_of_stay: date("last_date_of_stay").notNull(),
  forwarding_address: text("forwarding_address").notNull(),
  contact_after_vacating: varchar("contact_after_vacating", { length: 15 }).notNull(),
  room_condition: text("room_condition").notNull(),
  dues_clearance: varchar("dues_clearance", { length: 3 }).default("No").notNull(), // "Yes" or "No"
  key_submitted: varchar("key_submitted", { length: 3 }).default("No").notNull(), // "Yes" or "No"
  
  // Status and timestamps
  status: approval_status_pgEnum("status")
    .notNull()
    .default(approval_status.submitted),
    
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type VacatingHostel = typeof vacatingHostelModel.$inferSelect;
export type NewVacatingHostel = typeof vacatingHostelModel.$inferInsert;