import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { studentModel } from "./studentModel";
import { approval_status_pgEnum } from "./enum";
import { approval_status } from "../constants/enum";

export const summerVacationModel = pgTable("summer_vacation", {
  id: serial("id").primaryKey(),

  // Foreign key to student roll number
  roll_number: varchar("roll_number", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "cascade" }),

  // Summer vacation form details
  vacation_from: date("vacation_from").notNull(),
  vacation_to: date("vacation_to").notNull(),
  reason: text("reason").notNull(),
  destination: varchar("destination", { length: 100 }).notNull(),
  contact_during_vacation: varchar("contact_during_vacation", { length: 15 }).notNull(),
  local_guardian_consent: varchar("local_guardian_consent", { length: 3 }).notNull(), // "Yes" or "No"
  
  // Status and timestamps
  status: approval_status_pgEnum("status")
    .notNull()
    .default(approval_status.submitted),
    
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type SummerVacation = typeof summerVacationModel.$inferSelect;
export type NewSummerVacation = typeof summerVacationModel.$inferInsert;