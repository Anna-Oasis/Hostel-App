import { Router } from "express";
import {
  viewAdmissionsByDeputyWardenController,
  approveOrDeclineAdmissionByDeputyWardenController
} from "../controllers/deputyWardenController";
import { fetchAdmissionsApprovedByUser } from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";

const deputyWardenRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
deputyWardenRouter.get("/admissions", viewAdmissionsByDeputyWardenController);

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", approveOrDeclineAdmissionByDeputyWardenController);

deputyWardenRouter.get("/admissions/approvals/:user_id", errorWrapper(fetchAdmissionsApprovedByUser));

export default deputyWardenRouter;