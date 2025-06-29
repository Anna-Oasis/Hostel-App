import { pgTable, integer, varchar, text, date } from "drizzle-orm/pg-core";
import { rcModel } from "./rcModel";

export const rcDetailsModel = pgTable("rc_details", {
  userId: integer("user_id").notNull().primaryKey().references(() => rcModel.userId, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  dept: varchar("dept", { length: 100 }).notNull(),
  registerNo: varchar("register_no", { length: 20 }).notNull(),
  dob: date("dob").notNull(),
  mobile: varchar("mobile", { length: 15 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  guardianName: varchar("guardian_name", { length: 100 }).notNull(),
  residentialAddress: text("residential_address").notNull(),
  bloodGroup: varchar("blood_group", { length: 5 }).notNull(),
  medicalHistory: text("medical_history").notNull(),
});

export type RCDetails = typeof rcDetailsModel.$inferSelect;
export type NewRCDetails = typeof rcDetailsModel.$inferInsert;
export type RCDetailsUpdate = Partial<NewRCDetails> & { userId: number };
