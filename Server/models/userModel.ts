import {pgTable, serial, varchar, integer, boolean, date, text, jsonb} from 'drizzle-orm/pg-core';
import {user_role} from './enum';

export const userModel = pgTable('user', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    role: user_role('role').notNull()
});

export type User = typeof userModel.$inferSelect;
export type NewUser = typeof userModel.$inferInsert;