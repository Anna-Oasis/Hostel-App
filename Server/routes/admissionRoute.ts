import { Router } from "express";
//import { submitAdmission } from "../controllers/admissionController";
import { upload } from "../middleware/multer";

const router = Router();

router.post(
  "/",
  upload.fields([
    { name: "passportPhoto", maxCount: 1 },
    { name: "studentSignature", maxCount: 1 },
    { name: "parentGuardianSignature", maxCount: 1 },
  ]),
 // submitAdmission
);

export default router;