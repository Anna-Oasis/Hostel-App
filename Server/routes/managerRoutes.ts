import { Router } from 'express';
import { getAdmissionWaitingForApprovalController, updateApprovalStatusController,fetchAdmissionsApprovedByUser } from '../controllers/admissionController';
import errorWrapper from "../middleware/errorWrapper";
import { resolveGrievanceFromController, getGreivancesForManagerFromController } from '../controllers/grievanceController';
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';

const managerRouter = Router();

managerRouter.get("/admissions", authenticateUser ,hasRole(['manager']),errorWrapper(getAdmissionWaitingForApprovalController));

managerRouter.put("/admissions/:admission_id", authenticateUser,hasRole(['manager']),errorWrapper(updateApprovalStatusController));

managerRouter.get("/admissions/approvals",authenticateUser,hasRole(['manager']),errorWrapper(fetchAdmissionsApprovedByUser));

//PUT-manager/grievance
managerRouter.put("/grievance/:grievance_id",authenticateUser,hasRole(['manager']),errorWrapper(resolveGrievanceFromController));

//GET-manager/grievance
managerRouter.get("/grievance",authenticateUser,hasRole(['manager']),errorWrapper(getGreivancesForManagerFromController));

export default managerRouter;


