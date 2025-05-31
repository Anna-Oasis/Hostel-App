import { Router } from "express";
import { submitAdmission } from "../controllers/admissionController";
import { upload } from "../middleware/multer";

const admissionRouter = Router();

admissionRouter.post(
  "/",
  upload.fields([
    { name: "images[passportPhoto]", maxCount: 1 },
    { name: "images[studentSignature]", maxCount: 1 },
    { name: "images[parentGuardianSignature]", maxCount: 1 },
  ]),
  submitAdmission
);

export default admissionRouter;