import { pgEnum } from 'drizzle-orm/pg-core';

export const approval_status = pgEnum('approval_status', ['1', '2', '3']);
export const user_role = pgEnum('role', ['STUDENT', 'RC', 'DEPUTY_WARDEN', 'EXECUTIVE_WARDEN']);
