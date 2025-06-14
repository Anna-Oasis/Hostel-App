import { Admission } from "../models/admissionModel";
import { Router } from "express";
import { createAdmissionController, getAdmissionByAdmissionIdController,getAdmissionByRollNumberController,updateAdmissionController} from "../controllers/admissionController";
import { createGrievanceController,getGrievancesByRollNumberController } from "../controllers/grievanceController";


const studentRouter = Router();

studentRouter.post("/admission", (req, res) => {
  createAdmissionController(req, res);
});

studentRouter.get("/admission/:admissionId", (req, res) => {
  getAdmissionByAdmissionIdController(req, res);
});

studentRouter.get("/admission/roll-number/:roll_number", (req, res) => {
  getAdmissionByRollNumberController(req, res);
});

studentRouter.put("/admission/:admissionId", (req, res) => {
  updateAdmissionController(req, res);
});

studentRouter.post("/grievance", (req, res) => {
  createGrievanceController(req, res);
});

studentRouter.get("/grievance/:roll_number", (req, res) => {
  getGrievancesByRollNumberController(req, res);
});


export default studentRouter;
