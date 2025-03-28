import { Router } from "express";
const router = Router();
import {
  getAllReAdmissions,
  getReAdmissionById,
  createReAdmission,
  updateReAdmissionById,
  deleteReAdmissionById,
} from "../controllers/reAdmissionController.js";

router.route("/").get(getAllReAdmissions).post(createReAdmission);
router
  .route("/:id")
  .get(getReAdmissionById)
  .put(updateReAdmissionById)
  .delete(deleteReAdmissionById);

export default router;
