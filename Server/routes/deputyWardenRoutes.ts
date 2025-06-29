// deputyWardenRoutes.ts - Deputy Warden related routes for the Hostel App API
// Handles admissions, grievances, summer vacation, leave, room, RC management, vacating hostel, and attendance for Deputy Wardens

import { Router } from "express";
import {
  fetchAdmissionsApprovedByUser,
  fetchAdmissionWaitingForApprovalController,
  updateApprovalStatusByWardenController,
  allocateRoomController,
} from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser, hasRole } from "../middleware/rbacMiddleware";
import { getGrievancesForDeputyWardenController } from "../controllers/grievanceController";
import {
  approveSummerVacationDeputyWardenController,
  getSummerVacationFormsForDeputyWardenController,
} from "../controllers/summerVacationController";
import {
  approveVacatingFormByDeputyWardenController,
  getVacatingFormsForDeputyWardenController,
} from "../controllers/vacatingHostelController";
import {
  getLeaveFormWaitingForApprovalController,
  updateLeaveFormApprovalStatusController,
} from "../controllers/leaveController";
import {
  createRCController,
  deleteRCController,
  getRCsController,
  updateRCController,
} from "../controllers/rcController";
import { fetchRoomDetailsByBlockAndAcademicYearController } from "../controllers/roomController";
import {
  getRCLeaves,
  updateLeaveStatusForRC,
} from "../controllers/rcLeaveController";
import { getAllAttendanceController } from "../controllers/attendanceController";

const deputyWardenRouter = Router();

// Admission routes
deputyWardenRouter.get(
  "/admissions",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(fetchAdmissionWaitingForApprovalController)
);
deputyWardenRouter.put(
  "/admissions/:admission_id",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(updateApprovalStatusByWardenController)
);
deputyWardenRouter.get(
  "/admissions/approvals",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(fetchAdmissionsApprovedByUser)
);
deputyWardenRouter.put(
  "/admissions/room/:admission_id",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(allocateRoomController)
);

// Summer vacation routes
deputyWardenRouter.put(
  "/summer_vacation/:summer_vacation_id",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(approveSummerVacationDeputyWardenController)
);
deputyWardenRouter.get(
  "/summer_vacation",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(getSummerVacationFormsForDeputyWardenController)
);

// Grievance routes
deputyWardenRouter.get(
  "/grievance",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(getGrievancesForDeputyWardenController)
);

// Leave form routes
deputyWardenRouter.get(
  "/student_leave",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(getLeaveFormWaitingForApprovalController)
);
deputyWardenRouter.put(
  "/student_leave/:leave_form_id",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(updateLeaveFormApprovalStatusController)
);

// Room details route
deputyWardenRouter.get(
  "/rooms/:academicYear",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(fetchRoomDetailsByBlockAndAcademicYearController)
);

// Vacating hostel routes
deputyWardenRouter.get(
  "/vacating_hostel",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(getVacatingFormsForDeputyWardenController)
);
deputyWardenRouter.put(
  "/vacating_hostel/:vacating_hostel_id",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(approveVacatingFormByDeputyWardenController)
);

// RC management routes
deputyWardenRouter.post(
  "/rc",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(createRCController)
);
deputyWardenRouter.get(
  "/rc",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(getRCsController)
);
deputyWardenRouter.put(
  "/rc/:rc_id",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(updateRCController)
);
deputyWardenRouter.delete(
  "/rc/:rc_id",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(deleteRCController)
);

deputyWardenRouter.get(
  "/rc/leave",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(getRCLeaves)
);
deputyWardenRouter.put(
  "/rc/leave/:leave_id",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(updateLeaveStatusForRC)
);

// Attendance route
deputyWardenRouter.get(
  "/attendance/",
  authenticateUser,
  hasRole(["deputyWarden"]),
  errorWrapper(getAllAttendanceController)
);

export default deputyWardenRouter;
