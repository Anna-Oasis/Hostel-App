import { Router } from 'express';
import { fetchAdmissionWaitingForApprovalController, approveByManagerController,fetchAdmissionsApprovedByUser } from '../controllers/admissionController';
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
import { approveVacatingFormByManagerController, getVacatingFormsForManagerController } from '../controllers/vactingHostelController';
// import {
//   enterCautionDepositAndApproveController,
//   getVacatingFormsForManagerController
// } from "../controllers/vacatingHostelController";
const managerRouter = Router();

//const managerController = new ManagerController();

//router.get("/admissions/approvals", validateJWT, managerController.getAdmissionApprovals.bind(managerController));
//router.put("/grievance/:id", validateJWT, managerController.resolveGrievance.bind(managerController));
//router.get("/grievance", validateJWT, managerController.getGrievances.bind(managerController));
//update greivancesModel set resolved=true where greivancesmodel.id=greivance_id


managerRouter.get("/admissions", authenticateUser ,hasRole(['manager']),errorWrapper(fetchAdmissionWaitingForApprovalController));

managerRouter.put("/admissions/:admission_id", authenticateUser,hasRole(['manager']),errorWrapper(approveByManagerController));

managerRouter.get("/admissions/approvals",authenticateUser,hasRole(['manager']),errorWrapper(fetchAdmissionsApprovedByUser));

managerRouter.put("/vacating_hostel/:vacating_hostel_id",authenticateUser,hasRole(['manager']),errorWrapper(approveVacatingFormByManagerController));

managerRouter.get("/vacating_hostel",authenticateUser,hasRole(['manager']),errorWrapper(getVacatingFormsForManagerController));

export default managerRouter;


