import {
  pgTable,
  serial,
  integer,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const declarationModel = pgTable("declaration", {
  id: serial("id").primaryKey(),

  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type Declaration = typeof declarationModel.$inferSelect;
export type NewDeclaration = typeof declarationModel.$inferInsert;