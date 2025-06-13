import { Router } from "express";
import { fetchAdmissionsApprovedByRC } from "../controllers/rcAdmissionApprovalController";
import {
  viewAdmissionsByRC,
  approveOrDeclineAdmissionByRC,
  viewGrievancesByRC,
  approveOrDeclineGrievancesByRC
} from "../controllers/rcController";

import { fetchAdmissionsApprovedByRC } from "../controllers/rcAdmissionApprovalController";

const rcRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
rcRouter.get("/admissions/:rc_id", viewAdmissionsByRC);

// Approve or decline admission by RC with admission ID in path
rcRouter.put("/admissions/:admission_id", approveOrDeclineAdmissionByRC);

// Fetch all grievances waiting for RC approval by hostel block and floor
rcRouter.get("/grievance/:rc_id", viewGrievancesByRC);

// Approve or decline grievance by RC with grievance ID in body
rcRouter.put("/grievance/:rc_id", approveOrDeclineGrievancesByRC);


// Fetch the approval data reviewd by a particular RC
rcRouter.get("/admissions/approvals/:rc_id",(req,res,next) => {
    fetchAdmissionsApprovedByRC(req, res, next).catch(next);
})

export default rcRouter;

