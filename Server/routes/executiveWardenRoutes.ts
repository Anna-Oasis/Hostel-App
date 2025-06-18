import {Router} from 'express';
import { fetchAdmissionsApprovedByUser, fetchAdmissionWaitingForApprovalController,updateApprovalStatusByWardenController } from '../controllers/admissionController';
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';

const executiveWardenRouter = Router();

executiveWardenRouter.get("/", (req, res) => {
  res.send("👋 Welcome to the executiveWarden API!");
});

executiveWardenRouter.get("/admissions", authenticateUser, hasRole(['executiveWarden']), errorWrapper(fetchAdmissionWaitingForApprovalController));

executiveWardenRouter.put("/admissions/:admission_id", authenticateUser, hasRole(['executiveWarden']),errorWrapper(updateApprovalStatusByWardenController));

executiveWardenRouter.get("/admissions/approvals",authenticateUser ,hasRole(['executiveWarden']),errorWrapper(fetchAdmissionsApprovedByUser));
export default executiveWardenRouter;