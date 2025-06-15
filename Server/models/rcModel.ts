import {
  pgTable,
  integer,
  varchar,
  boolean,
  timestamp,
  serial,
} from "drizzle-orm/pg-core";
import { hostel_block_pgEnum } from "./enum";

import { userModel } from "./userModel";

export const rcModel = pgTable("rc", {
  
  id: serial("rc_id").primaryKey().references(() => userModel.id, { onDelete: "no action" }),
  name: varchar("name", { length: 100 }).notNull(),
  hostel: hostel_block_pgEnum("hostel").notNull(),
  onLeave: boolean("on_leave").notNull().default(false),
  floor: integer("floor").array().notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RC = typeof rcModel.$inferSelect;
export type NewRC = typeof rcModel.$inferInsert;
export type RCUpdate = Partial<NewRC> & { id: number };
