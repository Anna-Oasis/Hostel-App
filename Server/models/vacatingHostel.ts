import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  timestamp,
  time,
} from "drizzle-orm/pg-core";
import { studentModel } from "./studentModel";
import { endeavour_pgEnum, vacating_hostel_status_pgEnum } from "./enum";
import { endeavour, vacatingHostelApprovalStatus } from "../constants/enum";

export const vacatingHostelModel = pgTable("vacating_hostel", {
  id: serial("id").primaryKey(),

  // Foreign key to student roll number
  roll_number: varchar("roll_number", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "cascade" }),

  // Vacating hostel form details
  vacating_date: date("vacating_date").notNull(),
  vacating_time: time("vacating_time").notNull(),
  future_address: text("future_address").notNull(),
  returned_items: varchar("returned_items", { length: 100 }).array(),
  status: vacating_hostel_status_pgEnum("status")
    .notNull()
    .default(vacatingHostelApprovalStatus.SUBMITTED),  
  
  //Endeavours and feedback
  endeavour: endeavour_pgEnum("endeavour").notNull(),
  endeavourDescription: text("endeavour_description").notNull(),
  feedback: text("feedback").notNull(),

  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type VacatingHostel = typeof vacatingHostelModel.$inferSelect;
export type NewVacatingHostel = typeof vacatingHostelModel.$inferInsert;