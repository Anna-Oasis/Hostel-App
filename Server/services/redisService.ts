// services/redisService.ts
import { createClient, RedisClientType } from "redis";
import { logger } from "../utils/logger";

const redisUrl: string = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisClient: RedisClientType = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => logger.error(`🛑 Redis Client Error: ${err}`));

export async function initRedis(): Promise<void> {
  try {
    await redisClient.connect();
    logger.config("✅ Connected to Local Redis Server successfully...");
  } catch (error) {
    logger.error(`Failed to initialize Redis: ${error}`);
    throw error; // Re-throw so startServer() can catch it if it fails
  }
}