import { Router } from "express";
import {fetchAdmissionsApprovedByUser} from "../controllers/admissionController";
import {
  viewAdmissionsByRCController,
  approveOrDeclineAdmissionByRCController,
  viewGrievancesByRCController,
  approveOrDeclineGrievancesByRCController
} from "../controllers/rcController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
// import {
//   getVacatingFormsForRCController,
//   approveVacatingFormByRCController
// } from "../controllers/vacatingHostelController";


const rcRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
rcRouter.get("/admissions/:rc_id", viewAdmissionsByRCController);

// Approve or decline admission by RC with admission ID in path
rcRouter.put("/admissions/:admission_id", approveOrDeclineAdmissionByRCController);

// Fetch all grievances waiting for RC approval by hostel block and floor
rcRouter.get("/grievance/:rc_id", viewGrievancesByRCController);

// Approve or decline grievance by RC with grievance ID in body
rcRouter.put("/grievance/:rc_id", approveOrDeclineGrievancesByRCController);


// Fetch the approval data reviewd by a particular RC
rcRouter.get("/admissions/approvals",authenticateUser ,hasRole(['rc']),errorWrapper(fetchAdmissionsApprovedByUser));

// rcRouter.get("/vacating_hostel/:rc_id",errorWrapper(getVacatingFormsForRCController));
// rcRouter.put("/vacating_hostel/:rc_id",errorWrapper(approveVacatingFormByRCController));

export default rcRouter;

