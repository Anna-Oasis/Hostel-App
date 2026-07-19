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
  getAllSummerVacationFormsOfStudent} from '../controllers/summerVacationController';
import { upload } from "../middleware/multer";
import { authenticateUser, hasRole } from "../middleware/rbacMiddleware";
import {
  getStudentDetailsUsingRollNoController,
  createStudentDetailsController,
  updateStudentDetailsController,
  getStudentDetailsUsingUserIdController,
} from "../controllers/detailsController";
import {getDeclarationForOthersController} from '../controllers/declarationController';
import { createLeaveFormController,getAllLeaveFormsByRollNoController} from "../controllers/leaveController";


import {
  createVacatingHostelFormController,
  getVacatingHostelFormsOfaStudentController
} from "../controllers/vacatingHostelController";
import { getLatestAdmissionSessionForSemesterController } from "../controllers/admissionSessionController";
import {
  generateApplicationFormController,
  generateFeeReceiptController,
  generateReAdmissionFormController,
  generateRoomAllotmentFormController,
} from "../controllers/pdfController";

const studentRouter = Router();


//admission - students
studentRouter.post(
  "/admission",
  authenticateUser,
  hasRole(["student"]),
  upload.single("transactionPhotoUrl"),
  errorWrapper(createAdmissionController)
);

studentRouter.get("/admission/student/:roll_number", authenticateUser, hasRole(["student"]), errorWrapper(getAdmissionByRollNumberController));
studentRouter.get("/admission/:admissionId", authenticateUser, hasRole(["student"]), errorWrapper(getAdmissionByAdmissionIdController));
studentRouter.put("/admission/:admissionId", authenticateUser, hasRole(["student"]), errorWrapper(updateAdmissionController));

//Grievance
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
studentRouter.get("/details", authenticateUser, hasRole(['student']),errorWrapper(getStudentDetailsUsingUserIdController));
studentRouter.post("/details",fileFields,authenticateUser ,hasRole(['student']),errorWrapper(createStudentDetailsController));
studentRouter.put("/details/:roll_number",fileFields,authenticateUser ,hasRole(['student']),errorWrapper(updateStudentDetailsController));

// Vacating Hostel
studentRouter.get("/vacating_hostel",authenticateUser ,hasRole(['student']),errorWrapper(getVacatingHostelFormsOfaStudentController));
studentRouter.post("/vacating_hostel",authenticateUser ,hasRole(['student']),errorWrapper(createVacatingHostelFormController));

//LEAVE FORMS
studentRouter.post("/leave",authenticateUser,hasRole(['student']),errorWrapper(createLeaveFormController));
studentRouter.get("/leave/:roll_number",authenticateUser, hasRole(['student']),errorWrapper(getAllLeaveFormsByRollNoController));

// SUMMER VACATION FORMS
// create a new Summer vacation form
studentRouter.post("/summer_vacation",authenticateUser, hasRole(["student"]), errorWrapper(createSummerVacationFromController));
//fetch all applied summer vacation forms
studentRouter.get("/summer_vacation/:roll_number",authenticateUser, hasRole(['student']),errorWrapper(getAllSummerVacationFormsOfStudent));

//get all types of Latest Declarations  
studentRouter.get("/declaration",authenticateUser,hasRole(['student']),errorWrapper(getDeclarationForOthersController));
// GET latest active admission session for a semester
studentRouter.get(
  "/admission/session/:semester",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(getLatestAdmissionSessionForSemesterController)
);

//Fee-Receipt generation 
studentRouter.get(
  "/forms/feeReceipt/:addmissionid",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(generateFeeReceiptController)
)

studentRouter.get(
  "/forms/application-form",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(generateApplicationFormController)
);

studentRouter.get(
  "/forms/room-allotment-form",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(generateRoomAllotmentFormController)
);

studentRouter.get(
  "/forms/re-admission-form",
  authenticateUser,
  hasRole(["student"]),
  errorWrapper(generateReAdmissionFormController)
);

export default studentRouter;
