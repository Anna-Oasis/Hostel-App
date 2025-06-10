import {
  pgTable,
  serial,
  integer,
  boolean,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { summerVacationModel } from "./summerVacation";
import { userModel } from "./userModel";

export const summerVacationApprovalsModel = pgTable("summer_vacation_approvals", {
  //id: serial("id").primaryKey(),

  // Foreign key to summer vacation
  summer_vacation_id: integer("summer_vacation_id")
    .notNull()
    .references(() => summerVacationModel.id, { onDelete: "cascade" }),

  // Foreign key to users
  user_id: integer("user_id")
    .notNull()
    .references(() => userModel.id, { onDelete: "no action" }),

  approve: boolean("approve").notNull(),

  comment: text("comment"), // Optional field

  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type SummerVacationApproval = typeof summerVacationApprovalsModel.$inferSelect;
export type NewSummerVacationApproval = typeof summerVacationApprovalsModel.$inferInsert;