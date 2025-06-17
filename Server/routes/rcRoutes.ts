import { Router } from "express";
import {fetchAdmissionsApprovedByUser} from "../controllers/admissionController";
import {
  getAdmissionWaitingForApprovalByRCController,
  updateApprovalStatusByRCController,
  viewGrievancesByRCController,
  approveOrDeclineGrievancesByRCController
} from "../controllers/rcController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';



const rcRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
rcRouter.get("/admissions/:rc_id", getAdmissionWaitingForApprovalByRCController);

// Approve or decline admission by RC with admission ID in path
rcRouter.put("/admissions/:admission_id", updateApprovalStatusByRCController);

// Fetch all grievances waiting for RC approval by hostel block and floor
rcRouter.get("/grievance/:rc_id", viewGrievancesByRCController);

// Approve or decline grievance by RC with grievance ID in body
rcRouter.put("/grievance/:rc_id", approveOrDeclineGrievancesByRCController);


// Fetch the approval data reviewd by a particular RC
rcRouter.get("/admissions/approvals",authenticateUser ,hasRole(['rc']),errorWrapper(fetchAdmissionsApprovedByUser));

export default rcRouter;

