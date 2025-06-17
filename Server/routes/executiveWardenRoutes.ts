import {Router} from 'express';
import { fetchAdmissionsApprovedByUser } from '../controllers/admissionController';
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';

const executiveWardenRouter = Router();

executiveWardenRouter.get("/", (req, res) => {
  res.send("👋 Welcome to the executiveWarden API!");
});

// executiveWardenRouter.get("/admissions", (req, res) => {
//   getAdmissionWaitingForExecutiveWardenApprovalController(req,res)
// });
// executiveWardenRouter.put("/admissions/:admission_id", (req, res) => {
//   updateApprovalStatusController(req,res)
// });
executiveWardenRouter.get("/admissions/approvals",authenticateUser ,hasRole(['executiveWarden']),errorWrapper(fetchAdmissionsApprovedByUser));
export default executiveWardenRouter;