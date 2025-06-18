import { Router } from 'express';
import { fetchAdmissionWaitingForApprovalController, approveByManagerController,fetchAdmissionsApprovedByUser } from '../controllers/admissionController';
import errorWrapper from "../middleware/errorWrapper";
import { resolveGrievanceFromController, getGreivancesForManagerFromController } from '../controllers/grievanceController';
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';

const managerRouter = Router();

//const managerController = new ManagerController();

//router.get("/admissions/approvals", validateJWT, managerController.getAdmissionApprovals.bind(managerController));
//router.put("/grievance/:id", validateJWT, managerController.resolveGrievance.bind(managerController));
//router.get("/grievance", validateJWT, managerController.getGrievances.bind(managerController));
//update greivancesModel set resolved=true where greivancesmodel.id=greivance_id


managerRouter.get("/admissions", authenticateUser ,hasRole(['manager']),errorWrapper(fetchAdmissionWaitingForApprovalController));

managerRouter.put("/admissions/:admission_id", authenticateUser,hasRole(['manager']),errorWrapper(approveByManagerController));

managerRouter.get("/admissions/approvals",authenticateUser,hasRole(['manager']),errorWrapper(fetchAdmissionsApprovedByUser));

//PUT-manager/grievance
managerRouter.put("/grievance/:grievance_id",authenticateUser,hasRole(['manager']),errorWrapper(resolveGrievanceFromController));

//GET-manager/grievance
managerRouter.get("/grievance",authenticateUser,hasRole(['manager']),errorWrapper(getGreivancesForManagerFromController));

export default managerRouter;


