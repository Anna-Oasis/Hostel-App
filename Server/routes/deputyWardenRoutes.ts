import { Router } from "express";
import { fetchAdmissionsApprovedByUser, fetchAdmissionWaitingForApprovalController, updateApprovalStatusByWardenController } from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
import { getGrievancesFromDeputyWardenController } from "../controllers/grievanceController";

const deputyWardenRouter = Router();

// Fetch all admissions waiting for deputy warden approval by hostel block
deputyWardenRouter.get("/admissions", authenticateUser, hasRole(['deputyWarden']), errorWrapper(fetchAdmissionWaitingForApprovalController));

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", authenticateUser, hasRole(['deputyWarden']), errorWrapper(updateApprovalStatusByWardenController));

deputyWardenRouter.get("/admissions/approvals",authenticateUser,hasRole(['deputyWarden']), errorWrapper(fetchAdmissionsApprovedByUser));

//get All the greivance data
deputyWardenRouter.get("/grievance",authenticateUser,hasRole(['deputyWarden']),errorWrapper(getGrievancesFromDeputyWardenController));

export default deputyWardenRouter;
