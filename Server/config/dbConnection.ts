import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { logger } from '../utils/logger';

config({ path: '.env' }); 

let db: ReturnType<typeof drizzle>;

export async function initDb() {
  const client = postgres(process.env.DATABASE_URL!);
  try {
    await client`SELECT 1`;
    logger.config('✅ Database connected successfully');
    db = drizzle({ client });
  } catch (err) {
    logger.error(`Database connection failed: ${err}`);
    process.exit(1);
  }
}

export { db };