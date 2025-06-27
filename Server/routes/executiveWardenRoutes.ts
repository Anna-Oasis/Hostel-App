// executiveWardenRoutes.ts - Executive Warden related routes for the Hostel App API
// Handles admissions and room details for Executive Wardens

import { Router } from "express";
import {
  fetchAdmissionsApprovedByUser,
  fetchAdmissionWaitingForApprovalController,
  updateApprovalStatusByWardenController,
} from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser, hasRole } from "../middleware/rbacMiddleware";
import { fetchRoomDetailsByBlockAndAcademicYearController } from "../controllers/roomController";
import { postDeclarationFromController,getLatestDeclarationFromController} from "../controllers/declarationController";
import {
  getRCLeaves,
  updateLeaveStatusForRC,
} from "../controllers/rcLeaveController";

const executiveWardenRouter = Router();

// Welcome route
executiveWardenRouter.get("/", (req, res) => {
  res.send("👋 Welcome to the executiveWarden API!");
});

// Admission routes
executiveWardenRouter.get(
  "/admissions",
  authenticateUser,
  hasRole(["executiveWarden"]),
  errorWrapper(fetchAdmissionWaitingForApprovalController)
);
executiveWardenRouter.put(
  "/admissions/:admission_id",
  authenticateUser,
  hasRole(["executiveWarden"]),
  errorWrapper(updateApprovalStatusByWardenController)
);
executiveWardenRouter.get(
  "/admissions/approvals",
  authenticateUser,
  hasRole(["executiveWarden"]),
  errorWrapper(fetchAdmissionsApprovedByUser)
);

// Room details route
executiveWardenRouter.get(
  "/rooms",
  authenticateUser,
  hasRole(["executiveWarden"]),
  errorWrapper(fetchRoomDetailsByBlockAndAcademicYearController)
);

executiveWardenRouter.get(
  "/rc/leave",
  authenticateUser,
  hasRole(["executiveWarden"]),
  errorWrapper(getRCLeaves)
);
executiveWardenRouter.put(
  "/rc/leave/:leave_id",
  authenticateUser,
  hasRole(["executiveWarden"]),
  errorWrapper(updateLeaveStatusForRC)
);

executiveWardenRouter.post("/declaration",
  authenticateUser,
  hasRole(['executiveWarden']),
  errorWrapper(postDeclarationFromController)
);

executiveWardenRouter.get("/declaration/:type",
  authenticateUser,
  hasRole(['executiveWarden']),
  errorWrapper(getLatestDeclarationFromController)
);

export default executiveWardenRouter;
