import {pgTable, serial, text, varchar} from 'drizzle-orm/pg-core';
import{approval_status} from './approvalStatus';

export const admissionModel = pgTable('admission', {
    user_id: serial('user_id').primaryKey(),
    approval: approval_status('approval').notNull(),
    academic_year: varchar('academic_year', { length: 4 }).notNull(),
    payment_id: serial('payment_id').notNull()
});

export type Admission = typeof admissionModel.$inferSelect;
export type NewAdmission = typeof admissionModel.$inferInsert;
