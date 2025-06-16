import { Router } from 'express';
import { getAdmissionWaitingForApprovalController, updateApprovalStatusController } from '../controllers/admissionController';
import errorWrapper from "../middleware/errorWrapper";

const managerRouter = Router();

//const managerController = new ManagerController();

//router.get("/admissions/approvals", validateJWT, managerController.getAdmissionApprovals.bind(managerController));
//router.put("/grievance/:id", validateJWT, managerController.resolveGrievance.bind(managerController));
//router.get("/grievance", validateJWT, managerController.getGrievances.bind(managerController));
//update greivancesModel set resolved=true where greivancesmodel.id=greivance_id


managerRouter.get("/admissions", errorWrapper(getAdmissionWaitingForApprovalController));

managerRouter.put("/admissions/:admission_id", errorWrapper(updateApprovalStatusController));

export default managerRouter;


