import { Router } from "express";
import {
  viewAdmissionsByDeputyWardenController,
  approveOrDeclineAdmissionByDeputyWardenController,
} from "../controllers/deputyWardenController";
import { fetchAdmissionsApprovedByUser } from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
import { getGrievancesFromDeputyWardenController } from "../controllers/grievanceController";

const deputyWardenRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
deputyWardenRouter.get("/admissions", viewAdmissionsByDeputyWardenController);

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", approveOrDeclineAdmissionByDeputyWardenController);

deputyWardenRouter.get("/admissions/approvals",authenticateUser,hasRole(['deputyWarden']), errorWrapper(fetchAdmissionsApprovedByUser));

//get All the greivance data
deputyWardenRouter.get("/grievance",authenticateUser,hasRole(['deputyWarden']),errorWrapper(getGrievancesFromDeputyWardenController));

export default deputyWardenRouter;
