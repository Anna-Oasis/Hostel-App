import { Router } from "express";
import { fetchAdmissionsApprovedByUser, fetchAdmissionWaitingForApprovalController, updateApprovalStatusByWardenController } from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
import { getLeaveFormWaitingForApprovalController, updateLeaveFormApprovalStatusController } from "../controllers/leaveController";
import { fetchRoomDetailsByBlockAndAcademicYearController } from "../controllers/roomController";

const deputyWardenRouter = Router();

// Fetch all admissions waiting for deputy warden approval by hostel block
deputyWardenRouter.get("/admissions", authenticateUser, hasRole(['deputyWarden']), errorWrapper(fetchAdmissionWaitingForApprovalController));

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", authenticateUser, hasRole(['deputyWarden']), errorWrapper(updateApprovalStatusByWardenController));

deputyWardenRouter.get("/admissions/approvals",authenticateUser,hasRole(['deputyWarden']), errorWrapper(fetchAdmissionsApprovedByUser));

// Fetch all leave forms waiting for Deputy Warden approval by hostel block and floor 
deputyWardenRouter.get("/student_leave", authenticateUser ,hasRole(['deputyWarden']),errorWrapper(getLeaveFormWaitingForApprovalController));

// Approve or decline leave form by Deputy Warden with leave form ID in path
deputyWardenRouter.put("/student_leave/:leave_form_id",authenticateUser,hasRole(['deputyWarden']),errorWrapper(updateLeaveFormApprovalStatusController));

deputyWardenRouter.get("/rooms", authenticateUser,hasRole(['deputyWarden']), errorWrapper(fetchRoomDetailsByBlockAndAcademicYearController));
export default deputyWardenRouter;