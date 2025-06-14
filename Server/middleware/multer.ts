import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(`Created upload directory: ${uploadDir}`);
} else {
  console.log(`Upload directory already exists: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`Saving file to: uploads/`);
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const userId = req.body.user_id || "unknown";
    let signature = file.fieldname.match(/\[(.*?)\]/)?.[1] || file.fieldname;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${userId}-${signature}-${timestamp}${ext}`;
    console.log(
      `Generated filename: ${filename} for original file: ${file.originalname}`
    );
    cb(null, filename);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    console.log(
      `Received file: ${file.originalname}, mimetype: ${file.mimetype}`
    );
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
      console.log(`File accepted: ${file.originalname}`);
    } else {
      console.log(`File rejected (invalid type): ${file.originalname}`);
      cb(new Error("Only .jpeg, .png, .pdf files are allowed!"));
    }
  },
});
