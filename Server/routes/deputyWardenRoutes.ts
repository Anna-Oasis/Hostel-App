import { Router } from "express";
import { fetchAdmissionsApprovedByUser, fetchAdmissionWaitingForApprovalController, updateApprovalStatusByWardenController } from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
import { approveVacatingFormByDeputyWardenController, getVacatingFormsForDeputyWardenController } from "../controllers/vactingHostelController";
// import 
//   {
//     getVacatingFormsForDeputyWardenController,
//     approveVacatingFormByDeputyWardenController
//   } from "../controllers/vacatingHostelController";
const deputyWardenRouter = Router();

// Fetch all admissions waiting for deputy warden approval by hostel block
deputyWardenRouter.get("/admissions", authenticateUser, hasRole(['deputyWarden']), errorWrapper(fetchAdmissionWaitingForApprovalController));

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", authenticateUser, hasRole(['deputyWarden']), errorWrapper(updateApprovalStatusByWardenController));

deputyWardenRouter.get("/admissions/approvals",authenticateUser,hasRole(['deputyWarden']), errorWrapper(fetchAdmissionsApprovedByUser));

deputyWardenRouter.get("/vacating_hostel", authenticateUser,hasRole(['deputyWarden']),errorWrapper(getVacatingFormsForDeputyWardenController));

deputyWardenRouter.put("/vacating_hostel/:vacating_hostel_id", authenticateUser,hasRole(['deputyWarden']),errorWrapper(approveVacatingFormByDeputyWardenController));

export default deputyWardenRouter;