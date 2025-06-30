import {
  pgTable,
  serial,
  date,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

export const admissionSessionModel = pgTable("admission_session", {
  id: serial("id").primaryKey(),
  from: date("from").notNull(),
  to: date("to").notNull(),
  semesters: integer("semesters").array().notNull(),
  academic_year: varchar("academic_year", { length: 9 }).notNull(),
});

export type AdmissionSession = typeof admissionSessionModel.$inferSelect;
export type NewAdmissionSession = typeof admissionSessionModel.$inferInsert;
