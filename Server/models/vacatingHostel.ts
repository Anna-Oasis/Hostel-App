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
import { time } from "console";

export const vacatingHostelModel = pgTable("vacating_hostel", {
  id: serial("id").primaryKey(),

  // Foreign key to student roll number
  roll_number: varchar("roll_number", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "cascade" }),

  // Vacating hostel form details
  vacating_date: date("vacating_date").notNull(),
  vacating_time: timestamp("vacating_time").notNull(),
  future_address: text("future_address").notNull(),
  returned_items: varchar("returned_items", { length: 100 }).array(),
  status: approval_status_pgEnum("status")
    .notNull()
    .default(approval_status.submitted),   
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type VacatingHostel = typeof vacatingHostelModel.$inferSelect;
export type NewVacatingHostel = typeof vacatingHostelModel.$inferInsert;