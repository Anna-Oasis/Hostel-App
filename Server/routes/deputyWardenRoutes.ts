import { Router } from "express";
import { validateJWT } from "../middleware/jwt";
import { DeputyWardenController } from "../controllers/deputyWardenController";

const router = Router();
const deputyWardenController = new DeputyWardenController();

router.get("/admissions/approvals", validateJWT, deputyWardenController.getAdmissionApprovals.bind(deputyWardenController));

export default router;
