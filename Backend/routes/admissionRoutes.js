import { Router } from "express";
const router = Router();
import {
  getAllAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmissionById,
  deleteAdmissionById,
} from "../controllers/admissionController.js";

router.route("/").get(getAllAdmissions).post(createAdmission);
router
  .route("/:id")
  .get(getAdmissionById)
  .put(updateAdmissionById)
  .delete(deleteAdmissionById);

export default router;
