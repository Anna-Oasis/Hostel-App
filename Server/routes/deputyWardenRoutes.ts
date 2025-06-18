import { Router } from "express";
import {
  viewAdmissionsByDeputyWardenController,
  approveOrDeclineAdmissionByDeputyWardenController
} from "../controllers/deputyWardenController";
import { fetchAdmissionsApprovedByUser } from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
import { getVacatingFormsForDeputyWardenController } from "../controllers/vactingHostelController";
// import 
//   {
//     getVacatingFormsForDeputyWardenController,
//     approveVacatingFormByDeputyWardenController
//   } from "../controllers/vacatingHostelController";
const deputyWardenRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
deputyWardenRouter.get("/admissions", viewAdmissionsByDeputyWardenController);

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", approveOrDeclineAdmissionByDeputyWardenController);

deputyWardenRouter.get("/admissions/approvals",authenticateUser,hasRole(['deputyWarden']), errorWrapper(fetchAdmissionsApprovedByUser));

deputyWardenRouter.get("/vacating_hostel", authenticateUser,hasRole(['deputyWarden']),errorWrapper(getVacatingFormsForDeputyWardenController));

// deputyWardenRouter.put("/vacating_hostel/:vacating_hostel_id", authenticateUser,hasRole(['deputyWarden']),errorWrapper(approveVacatingFormByDeputyWardenController));

export default deputyWardenRouter;