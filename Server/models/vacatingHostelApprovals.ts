import {
  pgTable,
  serial,
  integer,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { vacatingHostelModel } from "./vacatingHostel";
import { userModel } from "./userModel";

export const vacatingHostelApprovalsModel = pgTable("vacating_hostel_approvals", {
 // id: serial("id").primaryKey(),

  // Foreign key to vacating hostel
  vacating_hostel_id: integer("vacating_hostel_id")
    .notNull()
    .references(() => vacatingHostelModel.id, { onDelete: "cascade" }),

  // Foreign key to users
  user_id: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "no action" }),

  approve: boolean("approve").notNull(),

  comment: text("comment"), // Optional field

  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type VacatingHostelApproval = typeof vacatingHostelApprovalsModel.$inferSelect;
export type NewVacatingHostelApproval = typeof vacatingHostelApprovalsModel.$inferInsert;