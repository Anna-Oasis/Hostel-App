import { int } from 'drizzle-orm/mysql-core';
import {pgTable, serial, varchar, integer, boolean, date, text, jsonb} from 'drizzle-orm/pg-core';
import { title } from 'process';

export const grievancesModel = pgTable('grievances', {
    room_id:integer('room_id').notNull(),
    user_id: integer('user_id'),
    description: text('description').notNull(),
    supportive_image: text('supportive_image'),
    title: varchar('title', { length: 100 }).notNull(),
});

export type Grievance = typeof grievancesModel.$inferSelect;
export type NewGrievance = typeof grievancesModel.$inferInsert;