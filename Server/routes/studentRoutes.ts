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
import {createSummerVacationFromController,getAllSummerVacationFormsOfStudent} from '../controllers/summerVacationController';
import { upload } from "../middleware/multer";
import { authenticateUser, hasRole } from "../middleware/rbacMiddleware";
import {
  getStudentDetailsController,
  createStudentDetailsController,
  updateStudentDetailsController,
  getStudentDetailsUsingUserIdController,
} from "../controllers/detailsController";
import { createLeaveFormFromController,getAllLeaveFormsFromController} from "../controllers/leaveController";


import {
  createVacatingHostelFormController,
  getVacatingHostelFormsOfaStudentController
} from "../controllers/vacatingHostelController";
import { getLatestAdmissionSessionForSemesterController } from "../controllers/admissionSessionController";

const studentRouter = Router();


//admission - students
studentRouter.post("/admission", authenticateUser, hasRole(["student"]), errorWrapper(createAdmissionController));
studentRouter.get("/admission/student/:roll_number", authenticateUser, hasRole(["student"]), errorWrapper(getAdmissionByRollNumberController));
studentRouter.get("/admission/:admissionId", authenticateUser, hasRole(["student"]), errorWrapper(getAdmissionByAdmissionIdController));
studentRouter.put("/admission/:admissionId", authenticateUser, hasRole(["student"]), errorWrapper(updateAdmissionController));

studentRouter.post("/grievance", authenticateUser, hasRole(["student"]),errorWrapper(createGrievanceController));
studentRouter.get("/grievance",authenticateUser, hasRole(["student"]), errorWrapper(getGrievancesByUserController));


const fileFields = upload.fields([
  { name: "passportPhotoUrl", maxCount: 1 },
  { name: "studentSignatureUrl", maxCount: 1 },
  { name: "parentGuardianSignatureUrl", maxCount: 1 },
  { name: "categoryProofUrl", maxCount: 1 },
  { name: "admissionSlipUrl", maxCount: 1 },
]);


// student Details
studentRouter.get("/details", authenticateUser, hasRole(['student']),errorWrapper(getStudentDetailsUsingUserIdController))
studentRouter.get("/details/:rollNo",authenticateUser ,hasRole(['student']),errorWrapper(getStudentDetailsController));
studentRouter.post("/details",fileFields,authenticateUser ,hasRole(['student']),errorWrapper(createStudentDetailsController));
studentRouter.put("/details/:rollNo",fileFields,authenticateUser ,hasRole(['student']),errorWrapper(updateStudentDetailsController));

// Vacating Hostel
studentRouter.get("/vacating_hostel",authenticateUser ,hasRole(['student']),errorWrapper(getVacatingHostelFormsOfaStudentController));
studentRouter.post("/vacating_hostel",authenticateUser ,hasRole(['student']),errorWrapper(createVacatingHostelFormController));

// LEAVE FORMS
studentRouter.post("/leave",authenticateUser,hasRole(['student']),errorWrapper(createLeaveFormFromController));
//get all the leave forms
studentRouter.get("/leave/:roll_number",authenticateUser, hasRole(['student']),errorWrapper(getAllLeaveFormsFromController));

// SUMMER VACATION FORMS
// create a new Summer vacation form
studentRouter.post("/summer_vacation",authenticateUser, hasRole(["student"]), errorWrapper(createSummerVacationFromController));
//fetch all applied summer vacation forms
studentRouter.get("/summer_vacation/:roll_number",authenticateUser, hasRole(['student']),errorWrapper(getAllSummerVacationFormsOfStudent));

// GET latest active admission session for a semester
studentRouter.get(
  "/admission/session/:semester",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(getLatestAdmissionSessionForSemesterController)
);

export default studentRouter;
