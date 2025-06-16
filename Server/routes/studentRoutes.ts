import { Admission } from "../models/admissionModel";
import { Router } from "express";
import {
  createAdmissionController,
  getAdmissionByAdmissionIdController,
  getAdmissionByRollNumberController,
  updateAdmissionController,
} from "../controllers/admissionController";
import {
  createGrievanceController,
  getGrievancesByRollNumberController,
} from "../controllers/grievanceController";
import errorWrapper from "../middleware/errorWrapper";
import { error } from "console";

const studentRouter = Router();


//admission - students
studentRouter.post("/admission", errorWrapper(createAdmissionController));
studentRouter.get( "/admission/:admissionId",errorWrapper(getAdmissionByAdmissionIdController));
studentRouter.get("/admission/student/:roll_number",errorWrapper(getAdmissionByRollNumberController));
studentRouter.put("/admission/:admissionId",errorWrapper(updateAdmissionController));

studentRouter.post("/grievance", (req, res) => {
  createGrievanceController(req, res);
});

studentRouter.get("/grievance/:roll_number", (req, res) => {
  getGrievancesByRollNumberController(req, res);
});

export default studentRouter;
