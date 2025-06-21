import {
  pgTable,
  serial,
  varchar,
  text,
  date,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { studentModel } from "./studentModel";
import { summer_vacation_status_pgEnum } from "./enum";
import { summer_vacation_status } from "../constants/enum";

export const summerVacationModel = pgTable("summer_vacation", {
  id: serial("id").primaryKey(),

  // Foreign key to student roll number
  roll_number: varchar("roll_number", { length: 20 })
    .notNull()
    .references(() => studentModel.rollNo, { onDelete: "cascade" }),

  // Summer vacation form details
  vacation_from: timestamp("vacation_from").notNull(),
  address_of_stay: varchar("address_of_stay", { length: 100 }).notNull(),
  returned_items: varchar("returned_items", { length: 100 }).array(),
  // Status and timestamps
  status: summer_vacation_status_pgEnum("status")
    .notNull()
    .default(summer_vacation_status.submitted),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type SummerVacation = typeof summerVacationModel.$inferSelect;
export type NewSummerVacation = typeof summerVacationModel.$inferInsert;
