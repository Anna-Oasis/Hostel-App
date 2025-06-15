import { Router } from "express";
import {
  viewAdmissionsByDeputyWarden,
  approveOrDeclineAdmissionByDeputyWarden
} from "../controllers/deputyWardenController";

const deputyWardenRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
deputyWardenRouter.get("/admissions", viewAdmissionsByDeputyWarden);

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", approveOrDeclineAdmissionByDeputyWarden);

export default deputyWardenRouter;

