// executiveWardenRoutes.ts - Executive Warden related routes for the Hostel App API
// Handles admissions and room details for Executive Wardens

import { Router } from "express";
import {
  fetchAdmissionsApprovedByUser,
  fetchAdmissionWaitingForApprovalController,
  updateApprovalStatusByWardenController,
  allocateRoomController
} from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser, hasRole } from "../middleware/rbacMiddleware";
import { fetchRoomDetailsByBlockAndAcademicYearController } from "../controllers/roomController";
import { postDeclarationFromController,getLatestDeclarationFromController} from "../controllers/declarationController";
import {
  getRCLeaves,
  updateLeaveStatusForRC,
} from "../controllers/rcLeaveController";
import {getDeclarationForOthersController} from '../controllers/declarationController';
import { createAdmissionSessionController, getAdmissionSessionsController, updateAdmissionSessionController } from "../controllers/admissionSessionController";
import { getAllRCDetailsController } from "../controllers/rcController";

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

executiveWardenRouter.put(
  "/admissions/room/:admission_id",
  authenticateUser,
  hasRole(["executiveWarden"]),
  errorWrapper(allocateRoomController)
);

executiveWardenRouter.post(
  "/admissions/session",
  authenticateUser,
  hasRole(["executiveWarden"]),
  errorWrapper(createAdmissionSessionController)
);
executiveWardenRouter.get(
  "/admissions/session",
  authenticateUser,
  hasRole(["executiveWarden"]),
  errorWrapper(getAdmissionSessionsController)
);
executiveWardenRouter.put(
  "/admissions/session/:id",
  authenticateUser,
  hasRole(["executiveWarden"]),
  errorWrapper(updateAdmissionSessionController)
);

// Room details route
executiveWardenRouter.get(
  "/rooms/:academicYear",
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

executiveWardenRouter.get("/declaration",
  authenticateUser,
  hasRole(['executiveWarden']),
  errorWrapper(getDeclarationForOthersController));

executiveWardenRouter.get(
  "/rc/details",
  authenticateUser,
  hasRole(["executiveWarden"]),
  getAllRCDetailsController
);

export default executiveWardenRouter;
