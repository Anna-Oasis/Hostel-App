import { Router } from 'express';
import { getAdmissionWaitingForApprovalController, updateApprovalStatusController } from '../controllers/admissionController';
import errorWrapper from "../middleware/errorWrapper";
import {getGreivancesForManagerFromController,resolveGrievanceFromController} from '../controllers/managerController';

const managerRouter = Router();

managerRouter.get("/admissions", errorWrapper(getAdmissionWaitingForApprovalController));

managerRouter.put("/admissions/:admission_id", errorWrapper(updateApprovalStatusController));

//PUT-manager/grievance
managerRouter.put("/grievance/:grievance_id",errorWrapper(resolveGrievanceFromController));

//GET-manager/grievance
managerRouter.get("/grievance",errorWrapper(getGreivancesForManagerFromController));

export default managerRouter;


