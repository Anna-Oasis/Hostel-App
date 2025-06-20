import { Router } from "express";
import {
  viewAdmissionsByDeputyWardenController,
  approveOrDeclineAdmissionByDeputyWardenController,
  getGrievancesFromDeputyWardenController
} from "../controllers/deputyWardenController";
import { fetchAdmissionsApprovedByUser } from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
import {approveSummerVacationDeputyWardenController,getSummerVacationFormsForDeputyWardenController} from '../controllers/summerVacationController';
const deputyWardenRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
deputyWardenRouter.get("/admissions", viewAdmissionsByDeputyWardenController);

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", approveOrDeclineAdmissionByDeputyWardenController);

//get All the greivance data
deputyWardenRouter.get("/grievance",errorWrapper(getGrievancesFromDeputyWardenController));

deputyWardenRouter.get("/admissions/approvals",authenticateUser,hasRole(['deputyWarden']), errorWrapper(fetchAdmissionsApprovedByUser));

//approve the summer vacation id by Deputy Warden
deputyWardenRouter.put("/summer_vacation/:summer_vacation_id",authenticateUser,hasRole(['deputyWarden']),errorWrapper(approveSummerVacationDeputyWardenController));

//get all summer vacation waiting for approval by Deputy Warden
deputyWardenRouter.get("/summer_vacation",authenticateUser,hasRole(['deputyWarden']),errorWrapper(getSummerVacationFormsForDeputyWardenController))
export default deputyWardenRouter;
