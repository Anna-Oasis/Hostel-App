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
import { upload } from "../middleware/multer";
import { authenticateUser, hasRole } from "../middleware/rbacMiddleware";
import {
  getStudentDetailsController,
  createStudentDetailsController,
  updateStudentDetailsController,
  getStudentDetailsUsingUserIdController,
} from "../controllers/detailsController";
import { createLeaveFormFromController,getAllLeaveFormsFromController} from "../controllers/leaveFormController";


import {
  createVacatingHostelFormController,
  getAllVacatingHostelFormsController,
} from "../controllers/vactingHostelController";

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
  { name: "aadhaarUrl", maxCount: 1 },
  { name: "admissionSlipUrl", maxCount: 1 },
]);



studentRouter.get(
  "/details", authenticateUser, hasRole(['student']),
  errorWrapper(getStudentDetailsUsingUserIdController)
)

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

studentRouter.get("/vacating_hostel",authenticateUser ,hasRole(['student']),errorWrapper(getAllVacatingHostelFormsController));
studentRouter.post("/vacating_hostel",authenticateUser ,hasRole(['student']),errorWrapper(createVacatingHostelFormController));

studentRouter.post(
  "/leave",
  authenticateUser,hasRole(['student']),
  errorWrapper(createLeaveFormFromController)
);

studentRouter.get(
  "/leave/:roll_number",
  authenticateUser,
  hasRole(['student']),
  errorWrapper(getAllLeaveFormsFromController)
);

export default studentRouter;
