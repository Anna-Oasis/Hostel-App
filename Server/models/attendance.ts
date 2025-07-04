import {
  pgTable,
  serial,
  date,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { rcModel } from "./rcModel";

export const attendanceModel = pgTable("attendance", {
  id: serial("id").primaryKey(),

  date: date("date").notNull(),

  // Foreign key to RC
  rc_id: integer("rc_id")
    .notNull()
    .references(() => rcModel.id, { onDelete: "cascade" }),

  hostel: varchar("hostel", { length: 50 }).notNull(),

  floor: integer("floor").notNull(),

  no_present: integer("no_present").notNull(),

  no_absent: integer("no_absent").notNull(),

  // Array of roll numbers as text array (stored as JSON-like string or comma-separated values)
  absentee: varchar("absentee", { length: 20 }).array().notNull(),

  // Timestamp
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type Attendance = typeof attendanceModel.$inferSelect;
export type NewAttendance = typeof attendanceModel.$inferInsert;