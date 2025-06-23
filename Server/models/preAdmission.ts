import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const preAdmissionModel = pgTable("preadmission", {
  id: serial("id").primaryKey(),

  email: varchar("email", { length: 30 }).notNull().unique(),
  name: varchar("name", { length: 30 }).notNull(),
  country: varchar("country", { length: 30 }).notNull(),
  nationality: varchar("nationality", { length: 30 }).notNull(),
  interestedCourse: varchar("interested_course", { length: 30 }).notNull(),
  interestedBranch: varchar("interested_branch", { length: 30 }).notNull(),
  alternateMail: varchar("alternate_email", { length: 30 }).notNull(),
  whatsappNumber: varchar("whatsapp_number", { length: 15 }).notNull(),
  remarks: text("remarks").notNull(),

  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export type PreAdmission = typeof preAdmissionModel.$inferSelect;
export type NewPreAdmission = typeof preAdmissionModel.$inferInsert;
