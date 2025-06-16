import {Router} from 'express';
import { getAdmissionWaitingForApprovalController,updateApprovalStatusController } from '../controllers/admissionController';

const executiveWardenRouter = Router();

executiveWardenRouter.get("/", (req, res) => {
  res.send("👋 Welcome to the Manager API!");
});

executiveWardenRouter.get("/admissions", (req, res) => {
  getAdmissionWaitingForExecutiveWardenApprovalController(req,res)
});
executiveWardenRouter.put("/admissions/:admission_id", (req, res) => {
  updateApprovalStatusController(req,res)
});
executiveWardenRouter.get("/admissions/approvals", (req, res) => {
  getAdmissionWaitingForApprovalController(req,res)
});
export default executiveWardenRouter;