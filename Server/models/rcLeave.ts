import {
  pgTable,
  serial,
  integer,
  date,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { rcModel } from "./rcModel";

export const rcLeaveModel = pgTable("rc_leave", {
  id: serial("id").primaryKey(),

  // Foreign key to RC
  rc_id: integer("rc_id")
    .notNull()
    .references(() => rcModel.id, { onDelete: "cascade" }),

  leaving: date("leaving").notNull(),

  arrival: date("arrival").notNull(),

  reason: text("reason").notNull(),

  approved: boolean("approved").default(false).notNull(),

  // Timestamps
  //created_at: timestamp("created_at").defaultNow().notNull(),
  //updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export type RCLeave = typeof rcLeaveModel.$inferSelect;
export type NewRCLeave = typeof rcLeaveModel.$inferInsert;