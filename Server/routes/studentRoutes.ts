// studentRoutes.ts - Student-related routes for the Hostel App API
// Handles admissions, grievances, details, leave, vacating hostel, and summer vacation forms

import { Router } from "express";
import {
  createAdmissionController,
  getAdmissionByAdmissionIdController,
  getAdmissionByRollNumberController,
  updateAdmissionController
} from "../controllers/admissionController";
import {
  createGrievanceController,
  getGrievancesByUserController,
} from "../controllers/grievanceController";
import errorWrapper from "../middleware/errorWrapper";
import {
  createSummerVacationFromController,
  getAllSummerVacationFormsOfStudent
} from '../controllers/summerVacationController';
import { upload } from "../middleware/multer";
import { authenticateUser, hasRole } from "../middleware/rbacMiddleware";
import {
  getStudentDetailsController,
  createStudentDetailsController,
  updateStudentDetailsController,
  getStudentDetailsUsingUserIdController,
} from "../controllers/detailsController";
import {
  createLeaveFormFromController,
  getAllLeaveFormsFromController
} from "../controllers/leaveController";
import {
  createVacatingHostelFormController,
  getAllVacatingHostelFormsController,
} from "../controllers/vactingHostelController";

const studentRouter = Router();

const fileFields = upload.fields([
  { name: "passportPhotoUrl", maxCount: 1 },
  { name: "studentSignatureUrl", maxCount: 1 },
  { name: "parentGuardianSignatureUrl", maxCount: 1 },
  { name: "categoryProofUrl", maxCount: 1 },
  { name: "aadhaarUrl", maxCount: 1 },
  { name: "admissionSlipUrl", maxCount: 1 },
]);

// Admission routes
studentRouter.post(
  "/admission",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(createAdmissionController)
);
studentRouter.get(
  "/admission/student/:roll_number",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(getAdmissionByRollNumberController)
);
studentRouter.get(
  "/admission/:admissionId",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(getAdmissionByAdmissionIdController)
);
studentRouter.put(
  "/admission/:admissionId",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(updateAdmissionController)
);

// Grievance routes
studentRouter.post(
  "/grievance",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(createGrievanceController)
);
studentRouter.get(
  "/grievance",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(getGrievancesByUserController)
);

// Student details routes
studentRouter.get(
  "/details",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(getStudentDetailsUsingUserIdController)
);
studentRouter.get(
  "/details/:rollNo",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(getStudentDetailsController)
);
studentRouter.post(
  "/details",
  fileFields,
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(createStudentDetailsController)
);
studentRouter.put(
  "/details/:rollNo",
  fileFields,
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(updateStudentDetailsController)
);

// Vacating hostel routes
studentRouter.get(
  "/vacating_hostel",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(getAllVacatingHostelFormsController)
);
studentRouter.post(
  "/vacating_hostel",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(createVacatingHostelFormController)
);

// Leave form routes
studentRouter.post(
  "/leave",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(createLeaveFormFromController)
);
studentRouter.get(
  "/leave/:roll_number",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(getAllLeaveFormsFromController)
);

// Summer vacation form routes
studentRouter.post(
  "/summer_vacation",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(createSummerVacationFromController)
);
studentRouter.get(
  "/summer_vacation/:roll_number",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(getAllSummerVacationFormsOfStudent)
);

export default studentRouter;
