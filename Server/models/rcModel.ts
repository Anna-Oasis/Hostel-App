import {
  pgTable,
  integer,
  varchar,
  boolean,
  date,
  serial,
} from "drizzle-orm/pg-core";

import { userModel } from "./userModel";

export const rcModel = pgTable("RC", {
  
  id: serial("rc_id").primaryKey().references(() => userModel.id, { onDelete: "no action" }),
  name: varchar("name", { length: 100 }).notNull(),
  hostel: varchar("hostel", { length: 50 }).notNull(),
  onLeave: boolean("on_leave"), // not null is not used here
  floor: integer("floor").array().notNull(), 

  // Timestamp
  createdAt: date("created_at").defaultNow().notNull(),
});

export type RC = typeof rcModel.$inferSelect;
export type NewRC = typeof rcModel.$inferInsert;
export type RCUpdate = Partial<NewRC> & { id: number };
