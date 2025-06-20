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
import {createSummerVacationFromController,getAllSummerVacationFormsFromController} from '../controllers/summerVacationController';
import { upload } from "../middleware/multer";
import { authenticateUser, hasRole } from "../middleware/rbacMiddleware";
import {
  getStudentDetailsController,
  createStudentDetailsController,
  updateStudentDetailsController,
} from "../controllers/detailsController";
import { createLeaveFormFromController,getAllLeaveFormsFromController} from "../controllers/leaveFormController";
const studentRouter = Router();


//admission - students
studentRouter.post("/admission", errorWrapper(createAdmissionController));
studentRouter.get( "/admission/:admissionId",errorWrapper(getAdmissionByAdmissionIdController));
studentRouter.get("/admission/student/:roll_number",errorWrapper(getAdmissionByRollNumberController));
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

//create a new Leave Form
studentRouter.post(
  "/leave",
  authenticateUser,hasRole(['student']),
  errorWrapper(createLeaveFormFromController)
);

//get all the leave forms
studentRouter.get(
  "/leave/:roll_number",
  authenticateUser,
  hasRole(['student']),
  errorWrapper(getAllLeaveFormsFromController)
);

//create a new Summer vacation form
studentRouter.post(
  "/summer_vacation",
  authenticateUser,
  hasRole(['student']),
  errorWrapper(createSummerVacationFromController)
);

//fetch all applied summer vacation forms
studentRouter.get("/summer_vacation/:roll_number",
  authenticateUser,
  hasRole(['student']),
    errorWrapper(getAllSummerVacationFormsFromController)
);

export default studentRouter;
