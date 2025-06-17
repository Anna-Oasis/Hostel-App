import { Router } from "express";
import {
  getAdmissionWaitingForApprovalByDeputyWardenController,
  updateApprovalStatusByDeputyWardenController
} from "../controllers/deputyWardenController";

const deputyWardenRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
deputyWardenRouter.get("/admissions", getAdmissionWaitingForApprovalByDeputyWardenController);

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", updateApprovalStatusByDeputyWardenController);

export default deputyWardenRouter;

