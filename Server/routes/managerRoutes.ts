import {Router} from 'express';
import { getAdmissionWaitingForApprovalController,updateApprovalStatusController } from '../controllers/admissionController';

const managerRouter = Router();

managerRouter.get("/", (req, res) => {
  res.send("👋 Welcome to the Manager API!");
});

managerRouter.get("/admissions", (req, res) => {
  getAdmissionWaitingForApprovalController(req,res)
});
managerRouter.put("/admissions/:admission_id", (req, res) => {
  updateApprovalStatusController(req,res)
});

export default managerRouter;