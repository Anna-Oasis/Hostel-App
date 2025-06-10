import { Router } from "express";
import { validateJWT } from "../middleware/jwt";
import { upload } from "../middleware/multer";
import { getDetailsByRollNo,createStudentDetails,updateStudentDetails } from "../controllers/detailsController";
const detailsRouter = Router();

detailsRouter.get("/:rollNo",(req,res,next) => {
    getDetailsByRollNo(req, res, next).catch(next);
})

detailsRouter.post(
  "/",
  upload.fields([
    { name: "passportPhotoUrl", maxCount: 1 },
    { name: "studentSignatureUrl", maxCount: 1 },
    { name: "parentGuardianSignatureUrl", maxCount: 1 },
    { name: "categoryProofUrl", maxCount: 1 },
    { name: "aadhaarUrl", maxCount: 1 },
    { name: "admissionSlipUrl", maxCount: 1 },
  ]),
  (req, res, next) => {
    createStudentDetails(req, res, next).catch(next);
  }
);



detailsRouter.put(
  "/:rollNo",
  upload.fields([
    { name: "passportPhotoUrl", maxCount: 1 },
    { name: "studentSignatureUrl", maxCount: 1 },
    { name: "parentGuardianSignatureUrl", maxCount: 1 },
    { name: "categoryProofUrl", maxCount: 1 },
    { name: "aadhaarUrl", maxCount: 1 },
    { name: "admissionSlipUrl", maxCount: 1 },
  ]),
  (req, res, next) => {
    updateStudentDetails(req, res, next).catch(next);
  }
);


export default detailsRouter;