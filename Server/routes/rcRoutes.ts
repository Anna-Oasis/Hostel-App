import { Router } from "express";
import { validateJWT } from "../middleware/jwt";
import { fetchAdmissionsApprovedByRC } from "../controllers/rcAdmissionApprovalController";

const rcRouter = Router();

rcRouter.get("/admissions/approvals/:rc_id",(req,res,next) => {
    fetchAdmissionsApprovedByRC(req, res, next).catch(next);
})

export default rcRouter;