import { Router } from "express";
import {fetchAdmissionsApprovedByUser , updateApprovalStatusByRCController,getAdmissionWaitingForApprovalByRCController} from "../controllers/admissionController";
import { approveOrDeclineGrievancesByRCController, viewGrievancesByRCController } from "../controllers/grievanceController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';



const rcRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
rcRouter.get("/admissions",authenticateUser,hasRole(["rc"]),errorWrapper( getAdmissionWaitingForApprovalByRCController));

// Approve or decline admission by RC with admission ID in path
rcRouter.put("/admissions/:admission_id",authenticateUser,hasRole(["rc"]),errorWrapper(updateApprovalStatusByRCController));

// Fetch all grievances waiting for RC approval by hostel block and floor
rcRouter.get("/grievance/:rc_id",authenticateUser,hasRole(["rc"]), errorWrapper(viewGrievancesByRCController));

// Approve or decline grievance by RC with grievance ID in body
rcRouter.put("/grievance/:rc_id", authenticateUser,hasRole(["rc"]), errorWrapper(approveOrDeclineGrievancesByRCController));


// Fetch the approval data reviewd by a particular RC
rcRouter.get("/admissions/approvals",authenticateUser ,hasRole(['rc']),errorWrapper(fetchAdmissionsApprovedByUser));

export default rcRouter;

