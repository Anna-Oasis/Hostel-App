import { Admission } from "../models/admissionModel";
import { Router } from "express";
import {
  createAdmissionController,
  getAdmissionByAdmissionIdController,
  getAdmissionByRollNumberController,
  updateAdmissionController,
} from "../controllers/admissionController";
import {
  createGrievanceController,
  getGrievancesByRollNumberController,
} from "../controllers/grievanceController";
import errorWrapper from "../middleware/errorWrapper";

import { upload } from "../middleware/multer";
import { authenticateUser, hasRole } from "../middleware/rbacMiddleware";
import {
  getStudentDetailsController,
  createStudentDetailsController,
  updateStudentDetailsController,
} from "../controllers/detailsController";

import { error } from "console";


const studentRouter = Router();


//admission - students
studentRouter.post("/admission", errorWrapper(createAdmissionController));
studentRouter.get( "/admission/student/:roll_number",errorWrapper(getAdmissionByRollNumberController));
studentRouter.get("/admission/:admissionId",errorWrapper(getAdmissionByAdmissionIdController));
studentRouter.put("/admission/:admissionId",errorWrapper(updateAdmissionController));

studentRouter.post("/grievance", errorWrapper(createGrievanceController));
studentRouter.get("/grievance/:roll_number", errorWrapper(getGrievancesByRollNumberController));


const fileFields = upload.fields([
  { name: "passportPhotoUrl", maxCount: 1 },
  { name: "studentSignatureUrl", maxCount: 1 },
  { name: "parentGuardianSignatureUrl", maxCount: 1 },
  { name: "categoryProofUrl", maxCount: 1 },
  { name: "aadhaarUrl", maxCount: 1 },
  { name: "admissionSlipUrl", maxCount: 1 },
]);


studentRouter.get(
  "/details/:rollNo",authenticateUser ,hasRole(['student']),
  errorWrapper(getStudentDetailsController)
);

studentRouter.post(
  "/details",
  fileFields,authenticateUser ,hasRole(['student']),
  errorWrapper(createStudentDetailsController)
);

studentRouter.put(
  "/details/:rollNo",
  fileFields,authenticateUser ,hasRole(['student']),
  errorWrapper(updateStudentDetailsController)
);

export default studentRouter;
