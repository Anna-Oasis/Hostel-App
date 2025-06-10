import { supabaseBucket } from "./../../config/supabaseBucket";
import * as fs from "fs";
import * as path from "path";

async function uploadFile(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  supabaseFolder: string
): Promise<{ data: any; error: any }> {
  const supabasePath = path.posix.join(supabaseFolder, fileName);

  const { data, error } = await supabaseBucket.upload(supabasePath, fileBuffer);

  return { data, error };
}

function getPublicUrl(fileName: string, supabaseFolder: string): string {
  const supabasePath = path.posix.join(supabaseFolder, fileName);
  const { data } = supabaseBucket.getPublicUrl(supabasePath);
  return data.publicUrl;
}

export { uploadFile, getPublicUrl };
