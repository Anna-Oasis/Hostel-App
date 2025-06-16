
import {Router} from 'express';
import { getAdmissionWaitingForApprovalController,updateApprovalStatusController } from '../controllers/admissionController';
import { Router } from "express";
import { ManagerController } from "../controllers/managerController";

const managerRouter = Router();

//const managerController = new ManagerController();

//router.get("/admissions/approvals", validateJWT, managerController.getAdmissionApprovals.bind(managerController));
//router.put("/grievance/:id", validateJWT, managerController.resolveGrievance.bind(managerController));
//router.get("/grievance", validateJWT, managerController.getGrievances.bind(managerController));
//update greivancesModel set resolved=true where greivancesmodel.id=greivance_id


managerRouter.get("/admissions", (req, res) => {
  getAdmissionWaitingForApprovalController(req,res)
});
managerRouter.put("/admissions/:admission_id", (req, res) => {
  updateApprovalStatusController(req,res)
});

export default managerRouter;


