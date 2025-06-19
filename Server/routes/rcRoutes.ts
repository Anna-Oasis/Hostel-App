import { Router } from "express";
import {fetchAdmissionsApprovedByUser , updateApprovalStatusByRCController,getAdmissionWaitingForApprovalByRCController} from "../controllers/admissionController";
import {
  viewGrievancesByRCController,
  approveOrDeclineGrievancesByRCController
} from "../controllers/rcController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
import {
  getVacatingFormsForRCController,
  approveVacatingFormByRCController
} from "../controllers/vactingHostelController";
import { getLeaveFormWaitingForApprovalController, updateLeaveFormApprovalStatusController } from "../controllers/leaveController";



const rcRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
rcRouter.get("/admissions",authenticateUser,hasRole(["rc"]),errorWrapper( getAdmissionWaitingForApprovalByRCController));

// Approve or decline admission by RC with admission ID in path
rcRouter.put("/admissions/:admission_id",authenticateUser,hasRole(["rc"]),errorWrapper(updateApprovalStatusByRCController));

// Fetch all grievances waiting for RC approval by hostel block and floor
rcRouter.get("/grievance/:rc_id", viewGrievancesByRCController);

// Approve or decline grievance by RC with grievance ID in body
rcRouter.put("/grievance/:rc_id", approveOrDeclineGrievancesByRCController);


// Fetch the approval data reviewd by a particular RC
rcRouter.get("/admissions/approvals",authenticateUser ,hasRole(['rc']),errorWrapper(fetchAdmissionsApprovedByUser));

// Fetch all leave forms waiting for RC approval by hostel block and floor 
rcRouter.get("/student_leave", authenticateUser ,hasRole(['rc']),errorWrapper(getLeaveFormWaitingForApprovalController));

// Approve or decline leave form by RC with leave form ID in path
rcRouter.put("/student_leave/:leave_form_id",authenticateUser,hasRole(["rc"]),errorWrapper(updateLeaveFormApprovalStatusController));

rcRouter.get("/vacating_hostel/:rc_id",authenticateUser ,hasRole(['rc']),errorWrapper(getVacatingFormsForRCController));
rcRouter.put("/vacating_hostel/:rc_id",authenticateUser ,hasRole(['rc']),errorWrapper(approveVacatingFormByRCController));

export default rcRouter;

