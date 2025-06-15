import { studentModel } from './studentModel';
import { pgTable, varchar, integer, primaryKey } from "drizzle-orm/pg-core";


export const roomModel = pgTable("room", {
  roomNumber: integer("room_number").notNull(),
  hostelBlock: varchar("hostel_block", { length: 20 }).notNull(),
  academicYear: varchar("academic_year", { length: 9 }).notNull(),
  floor : integer("floor").notNull(),
  admissionId: integer("admission_id")
    .notNull().references(() => studentModel.rollNo, { onDelete: "no action" }).array(),
}, (table) => ({
  pk: primaryKey({ columns: [table.roomNumber, table.hostelBlock, table.academicYear] })
}));

export type Room = typeof roomModel.$inferSelect;
export type NewRoom = typeof roomModel.$inferInsert;