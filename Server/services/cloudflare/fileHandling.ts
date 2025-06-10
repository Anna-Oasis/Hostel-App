import {S3 ,BUCKET,CLOUD_FLARE_DOMAIN} from "../../config/cloudflare"
import * as path from "path";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";


async function uploadFile(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  folder: string
): Promise<{ data: any; error: any }> {
  const cloudflarePath = path.posix.join(folder, fileName);
  try {
    const data = await S3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: cloudflarePath,
        Body: fileBuffer,
      })
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

function getPublicUrl(fileName: string, cloudflareFolder: string): string {
  const cloudflarePath = path.posix.join(cloudflareFolder, fileName);
  return `${CLOUD_FLARE_DOMAIN}/${cloudflarePath}`;
}

export { uploadFile, getPublicUrl };
