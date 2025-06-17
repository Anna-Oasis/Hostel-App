import { Router } from 'express';
import { getAdmissionWaitingForApprovalByManagerController, updateApprovalStatusByManagerController } from '../controllers/managerController';
import errorWrapper from "../middleware/errorWrapper";

const managerRouter = Router();

//const managerController = new ManagerController();

//router.get("/admissions/approvals", validateJWT, managerController.getAdmissionApprovals.bind(managerController));
//router.put("/grievance/:id", validateJWT, managerController.resolveGrievance.bind(managerController));
//router.get("/grievance", validateJWT, managerController.getGrievances.bind(managerController));
//update greivancesModel set resolved=true where greivancesmodel.id=greivance_id


managerRouter.get("/admissions", errorWrapper(getAdmissionWaitingForApprovalByManagerController));
managerRouter.put("/admissions/:admission_id", errorWrapper(updateApprovalStatusByManagerController));

export default managerRouter;


