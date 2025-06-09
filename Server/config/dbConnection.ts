import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { logger } from '../utils/logger';

config({ path: '.env' }); 

let db: ReturnType<typeof drizzle>;
console.log(process.env.DATABASE_URL);

export async function initDb() {
  const client = postgres(process.env.DATABASE_URL!);
  try {
    await client`SELECT 1`;
    logger.config('✅ Database connected successfully');
    db = drizzle({client});
  } catch (err) {
    logger.error(`Database connection failed: ${err}`);
    process.exit(1);
  }
}

export { db };


// import { config } from 'dotenv';
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
// import { logger } from '../utils/logger';

// config({ path: '.env' });

// let db: ReturnType<typeof drizzle>;

// export async function initDb() {
//   const client = postgres({
//     host: '127.0.0.1',              // use IP instead of localhost
//     port: 1710,
//     user: 'postgres',
//     password: 'Admin123',
//     database: 'hostelApp',
//     ssl: false,                     // disable SSL for local
//   });

//   try {
//     await client`SELECT 1`;
//     logger.config('✅ Database connected successfully');
//     db = drizzle(client);          // remove { client } – pass only the instance
//   } catch (err) {
//     logger.error(`Database connection failed: ${err}`);
//     process.exit(1);
//   }
// }

// export { db };
