import { Router } from "express";
import {
  viewAdmissionsByRC,
  approveOrDeclineAdmissionByRC
} from "../controllers/rcController";

const rcRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
rcRouter.get("/admissions/:rc_id", viewAdmissionsByRC);

// Approve or decline admission by RC with admission ID in path
rcRouter.put("/admissions/:admission_id", approveOrDeclineAdmissionByRC);

export default rcRouter;
