import { Router } from "express";
import admissionRouter from "./admissionRoutes.js";
import reAdmissionRouter from "./reAdmissionRoutes.js";

const router = Router();

router.use("/admission", admissionRouter);
router.use("/readmission", reAdmissionRouter);

export default router;
