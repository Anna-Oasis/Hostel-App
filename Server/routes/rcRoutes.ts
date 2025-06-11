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


// fetch the approval data reviewd by a particular RC
rcRouter.get("/admissions/approvals/:rc_id",(req,res,next) => {
    fetchAdmissionsApprovedByRC(req, res, next).catch(next);
})

export default rcRouter;

