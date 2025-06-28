// rcRoutes.ts - RC (Resident Coordinator) related routes for the Hostel App API
// Handles admissions, grievances, summer vacation, leave, room, student, vacating hostel, and attendance management for RCs

import { Router } from "express";
import {
  fetchAdmissionsApprovedByUser,
  updateApprovalStatusByRCController,
  getAdmissionWaitingForApprovalByRCController
} from "../controllers/admissionController";
import {
  approveOrDeclineGrievancesByRCController,
  viewGrievancesByRCController
} from "../controllers/grievanceController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser, hasRole } from '../middleware/rbacMiddleware';
import {
  approveSummerVacationFormByRCController,
  getSummerVacationFormsForRCController
} from '../controllers/summerVacationController';
import {
  getVacatingFormsForRCController,
  approveVacatingFormByRCController
} from "../controllers/vacatingHostelController";
import {
  getLeaveFormWaitingForApprovalController,
  updateLeaveFormApprovalStatusController
} from "../controllers/leaveController";
import { fetchRoomDetailsByBlockAndAcademicYearController } from "../controllers/roomController";
import { fetchStudentDetailsForRcController } from "../controllers/detailsController";
import {
  createAttendanceByRcController,
  getAttendanceByRcController
} from "../controllers/attendanceController";
import {  getRCsController } from "../controllers/rcController";
import { getRCLeaveApprovals } from "../services/rcLeaveService";
import { createRCLeaveFormFromController, getRCLeaveController, updateCompleteLeave, fetchRCbyHostelController } from "../controllers/rcLeaveController";



const rcRouter = Router();

// Admission routes
rcRouter.get(
  "/admissions",
  authenticateUser,
  hasRole(["rc"]),
  errorWrapper(getAdmissionWaitingForApprovalByRCController)
);
rcRouter.put(
  "/admissions/:admission_id",
  authenticateUser,
  hasRole(["rc"]),
  errorWrapper(updateApprovalStatusByRCController)
);
rcRouter.get(
  "/admissions/approvals",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(fetchAdmissionsApprovedByUser)
);

// Grievance routes
rcRouter.get(
  "/grievance",
  authenticateUser,
  hasRole(["rc"]),
  errorWrapper(viewGrievancesByRCController)
);
rcRouter.put(
  "/grievance/:grievance_id",
  authenticateUser,
  hasRole(["rc"]),
  errorWrapper(approveOrDeclineGrievancesByRCController)
);

// Summer vacation routes
rcRouter.get(
  "/summer_vacation",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(getSummerVacationFormsForRCController)
);
rcRouter.put(
  "/summer_vacation/:summer_vacation_id",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(approveSummerVacationFormByRCController)
);

// Leave form routes
rcRouter.get(
  "/student_leave",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(getLeaveFormWaitingForApprovalController)
);
rcRouter.put(
  "/student_leave/:leave_form_id",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(updateLeaveFormApprovalStatusController)
);

// Room and student details routes
rcRouter.get(
  "/rooms/:academicYear",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(fetchRoomDetailsByBlockAndAcademicYearController)
);
rcRouter.get(
  "/students",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(fetchStudentDetailsForRcController)
);

// Vacating hostel routes
rcRouter.get(
  "/vacating_hostel",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(getVacatingFormsForRCController)
);
rcRouter.put(
  "/vacating_hostel",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(approveVacatingFormByRCController)
);

// Attendance routes
rcRouter.get(
  "/attendance",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(getAttendanceByRcController)
);
rcRouter.post(
  "/attendance",
  authenticateUser,
  hasRole(['rc']),
  errorWrapper(createAttendanceByRcController)
);

rcRouter.post("/leave", authenticateUser, hasRole(['rc']), errorWrapper(createRCLeaveFormFromController));
rcRouter.get("/leave", authenticateUser, hasRole(['rc']), errorWrapper(getRCLeaveController));
rcRouter.post("/leave/complete", authenticateUser, hasRole(['rc']), errorWrapper(updateCompleteLeave))

// Fetch the all the RCs as same as the RC's own hostel
rcRouter.get("/list", authenticateUser, hasRole(['rc']), errorWrapper(fetchRCbyHostelController))

export default rcRouter;

