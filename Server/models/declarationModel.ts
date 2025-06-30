import {
  pgTable,
  serial,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
import {declarationEnum} from './enum';

export const declarationModel = pgTable("declaration", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  type: declarationEnum("type").notNull(),
  declarations: varchar("declarations", { length: 1000 }).array().notNull(),
});

export type Declaration = typeof declarationModel.$inferSelect;
export type NewDeclaration = typeof declarationModel.$inferInsert;