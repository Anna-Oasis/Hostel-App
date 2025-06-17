import { Router } from "express";
import {
  viewAdmissionsByDeputyWardenController,
  approveOrDeclineAdmissionByDeputyWardenController,
  getGrievancesFromDeputyWardenController
} from "../controllers/deputyWardenController";
import errorWrapper from "../middleware/errorWrapper";

const deputyWardenRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
deputyWardenRouter.get("/admissions", viewAdmissionsByDeputyWardenController);

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", approveOrDeclineAdmissionByDeputyWardenController);

//get All the greivance data
deputyWardenRouter.get("/grievance",errorWrapper(getGrievancesFromDeputyWardenController));


export default deputyWardenRouter;

