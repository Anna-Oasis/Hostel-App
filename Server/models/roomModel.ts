import { pgTable, varchar, integer, primaryKey } from "drizzle-orm/pg-core";


export const roomModel = pgTable("room", {
  roomNumber: integer("room_number").notNull(),
  hostelBlock: varchar("hostel_block", { length: 20 }).notNull(),
  academicYear: varchar("academic_year", { length: 9 }).notNull(),
  floor : integer("floor").notNull(),
  rollNo: varchar("rollNo", { length: 20}).array(),
  }, (table) => ({
  pk: primaryKey({ columns: [table.roomNumber, table.hostelBlock, table.academicYear] })
}));

export type Room = typeof roomModel.$inferSelect;
export type NewRoom = typeof roomModel.$inferInsert;