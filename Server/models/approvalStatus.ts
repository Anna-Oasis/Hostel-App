import { pgEnum } from 'drizzle-orm/pg-core';

export const approval_status = pgEnum('approval_status', ['1', '2', '3']);
