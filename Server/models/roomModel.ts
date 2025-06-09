import { studentModel } from './studentModel';
import { admissionModel } from './admissionModel';
import { pgTable, varchar, integer, primaryKey } from "drizzle-orm/pg-core";


export const roomModel = pgTable("room", {
  roomNumber: varchar("room_number", { length: 10 }).notNull(),
  hostelBlock: varchar("hostel_block", { length: 20 }).notNull(),
  academicYear: varchar("academic_year", { length: 9 }).notNull(),
  rollno: varchar("roll_no", { length: 20 })
    .notNull().references(() => studentModel.rollNo, { onDelete: "no action" }),
  admissionId: integer("admission_id")
    .notNull().references(() => admissionModel.id, { onDelete: "no action" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.roomNumber, table.hostelBlock, table.academicYear] })
}));


export type Room = typeof roomModel.$inferSelect;
export type NewRoom = typeof roomModel.$inferInsert;