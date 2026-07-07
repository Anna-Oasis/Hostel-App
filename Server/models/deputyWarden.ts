import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { hostel_block_pgEnum } from "./enum";
import { userModel } from "./userModel";

export const deputyWardenModel = pgTable("deputy_warden", {
  id: serial("deputy_warden_id").primaryKey(),

  userId: integer("user_id")
    .notNull()
    .unique()
    .references(() => userModel.id, { onDelete: "cascade" }),

  name: varchar("name", { length: 100 }).notNull(),

  block: hostel_block_pgEnum("block").notNull(),

  dept: varchar("dept", { length: 100 }).notNull(),

  email: varchar("email", { length: 100 }).notNull(),

  passportPhotoUrl: text("passport_photo_url"),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull(),
});

export type DeputyWarden = typeof deputyWardenModel.$inferSelect;
export type NewDeputyWarden = typeof deputyWardenModel.$inferInsert;
export type DeputyWardenUpdate = Partial<NewDeputyWarden> & {
  userId : number
};