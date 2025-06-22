import fs from "fs/promises";
import { uploadFile, getPublicUrl } from "./fileHandling";



export const handleFileUpload = async (
  file: Express.Multer.File,
  userId: string,
  folder: string,
  signature: string
): Promise<string> => {
  const ext = file.originalname
    ? file.originalname.substring(file.originalname.lastIndexOf("."))
    : "";
  const timestampMatch = file.filename.match(/-(\d+)\./);
  const timestamp = timestampMatch ? timestampMatch[1] : Date.now();
  const newFileName = `${userId}-${signature}-${timestamp}${ext}`;
  // console.log(`📤 Uploading ${signature} as: ${newFileName} to ${folder}`);

  try {
    const fileBuffer = await fs.readFile(file.path);
    const { error } = await uploadFile(fileBuffer, newFileName, folder);

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const publicUrl = getPublicUrl(newFileName, folder);
    // console.log(`✅ Uploaded ${signature} => ${publicUrl}`);
    return publicUrl;
  } finally {
    try {
      await fs.unlink(file.path);
      // console.log(`🧹 Deleted temp file: ${file.path}`);
    } catch (err) {
      console.error(`❌ Failed to delete temp file: ${file.path}`, err);
    }
  }
};