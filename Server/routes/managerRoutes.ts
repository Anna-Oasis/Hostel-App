import { Router } from 'express';
import { getAdmissionWaitingForApprovalController, updateApprovalStatusController,fetchAdmissionsApprovedByUser } from '../controllers/admissionController';
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';

const managerRouter = Router();

//const managerController = new ManagerController();

//router.get("/admissions/approvals", validateJWT, managerController.getAdmissionApprovals.bind(managerController));
//router.put("/grievance/:id", validateJWT, managerController.resolveGrievance.bind(managerController));
//router.get("/grievance", validateJWT, managerController.getGrievances.bind(managerController));
//update greivancesModel set resolved=true where greivancesmodel.id=greivance_id


managerRouter.get("/admissions", authenticateUser ,hasRole(['manager']),errorWrapper(getAdmissionWaitingForApprovalController));

managerRouter.put("/admissions/:admission_id", authenticateUser,hasRole(['manager']),errorWrapper(updateApprovalStatusController));

managerRouter.get("/admissions/approvals",authenticateUser,hasRole(['manager']),errorWrapper(fetchAdmissionsApprovedByUser));

export default managerRouter;


