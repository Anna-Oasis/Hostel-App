import { Router } from "express";
import { submitAdmission } from "../controllers/admissionController";
import { upload } from "../middleware/multer";
import { getAdmissionById } from "../controllers/admissionController";
import { getAdmissionByUserId } from "../controllers/admissionController";

const admissionRouter = Router();

admissionRouter.post(
  "/",
  upload.fields([
    { name: "images[passportPhoto]", maxCount: 1 },
    { name: "images[studentSignature]", maxCount: 1 },
    { name: "images[parentGuardianSignature]", maxCount: 1 },
  ]),
  (req, res, next) => {
    submitAdmission(req, res, next).catch(next);
  }
);

//get routes to fetch by  addmissonid
admissionRouter.get("/:admissionId", (req, res,next) => {
  getAdmissionById(req, res,next).catch(next);
});

export default admissionRouter;

//fetch admission by userID
 admissionRouter.get("/user/:user_id", (req, res, next) => {
   getAdmissionByUserId(req, res, next).catch(next);
 });

