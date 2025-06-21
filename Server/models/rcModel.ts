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
  id: serial("rc_id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => userModel.id, { onDelete: "set null" }),
  name: varchar("name", { length: 100 }).notNull(),
  hostel: hostel_block_pgEnum("hostel").notNull(),
  onLeave: boolean("on_leave").notNull().default(false),
  floor: integer("floor").array().default([]).notNull(),
  alternatingToRCId: integer("alternating_to_rc_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type RC = typeof rcModel.$inferSelect;
export type NewRC = typeof rcModel.$inferInsert;
export type RCUpdate = Partial<NewRC> & { id: number };
