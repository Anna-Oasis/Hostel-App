import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const userModel = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).default("student").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof userModel.$inferSelect;
export type NewUser = typeof userModel.$inferInsert;