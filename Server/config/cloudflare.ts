import {
  S3Client,
  HeadBucketCommand
} from "@aws-sdk/client-s3";
import { config } from "dotenv";
import { logger } from "../utils/logger";

config();

const ACCOUNT_ID: string | undefined = process.env.CLOUDFLARE_ACCOUNT_ID;
const ACCESS_KEY_ID: string | undefined = process.env.CLOUDFLARE_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY: string | undefined = process.env.CLOUDFLARE_SECRET_ACCESS_KEY;
const BUCKET: string | undefined = process.env.CLOUDFLARE_BUCKET_NAME;
const CLOUD_FLARE_DOMAIN: string | undefined = process.env.CLOUDFLARE_BUCKET_DOMAIN;
if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET || !CLOUD_FLARE_DOMAIN) {
  console.error("Missing Cloudflare environment variables");
  process.exit(1);
}
const S3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID!,
    secretAccessKey: SECRET_ACCESS_KEY!,
  },
});

async function initCloudflare() {

  try {
    const data = await S3.send(new HeadBucketCommand({ Bucket: BUCKET }));
    logger.config("✅ Connected to Cloudflare successfully");
  } catch (err) {
    logger.error(`Cloudflare connection failed: ${err}`);
  }
}

export { initCloudflare, S3, CLOUD_FLARE_DOMAIN ,BUCKET };