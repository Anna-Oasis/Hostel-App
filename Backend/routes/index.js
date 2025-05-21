import { Router } from "express";
import admissionRouter from "./admissionRoutes.js";
import reAdmissionRouter from "./reAdmissionRoutes.js";
import { login, register } from "../controllers/authController.js";
import authRouter from "./authRoutes.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { getAllAdmissions, createAdmission } from "../controllers/admissionController.js";

const router = Router();

router.use("/auth", authRouter)
router.use("/admission", protect,admissionRouter);
router.use("/readmission", protect,reAdmissionRouter);

router.route("/")
  .get(protect, authorize('warden', 'RC'), getAllAdmissions)
  .post(protect, authorize('warden'), createAdmission);


export default router;
