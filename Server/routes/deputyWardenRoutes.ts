import { Router } from "express";
import { fetchAdmissionsApprovedByUser, fetchAdmissionWaitingForApprovalController, updateApprovalStatusByWardenController } from "../controllers/admissionController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
import { getGrievancesForDeputyWardenController } from "../controllers/grievanceController";
import {approveSummerVacationDeputyWardenController,getSummerVacationFormsForDeputyWardenController} from '../controllers/summerVacationController';

import { approveVacatingFormByDeputyWardenController, getVacatingFormsForDeputyWardenController } from "../controllers/vactingHostelController";

import { getLeaveFormWaitingForApprovalController, updateLeaveFormApprovalStatusController } from "../controllers/leaveController";

import { createRCController, deleteRCController, getRCsController, updateRCController } from "../controllers/rcController";

import { fetchRoomDetailsByBlockAndAcademicYearController } from "../controllers/roomController";
import { getRCLeaves, updateLeaveStatusForRC } from "../controllers/rcLeaveController";
import { getAllAttendanceController } from "../controllers/attendanceController";


const deputyWardenRouter = Router();

// Fetch all admissions waiting for deputy warden approval by hostel block
deputyWardenRouter.get("/admissions", authenticateUser, hasRole(['deputyWarden']), errorWrapper(fetchAdmissionWaitingForApprovalController));

// Approve or decline admission by RC with admission ID in path
deputyWardenRouter.put("/admissions/:admission_id", authenticateUser, hasRole(['deputyWarden']), errorWrapper(updateApprovalStatusByWardenController));

deputyWardenRouter.get("/admissions/approvals",authenticateUser,hasRole(['deputyWarden']), errorWrapper(fetchAdmissionsApprovedByUser));

//approve the summer vacation id by Deputy Warden
deputyWardenRouter.put("/summer_vacation/:summer_vacation_id",authenticateUser,hasRole(['deputyWarden']),errorWrapper(approveSummerVacationDeputyWardenController));

//get all summer vacation waiting for approval by Deputy Warden
deputyWardenRouter.get("/summer_vacation",authenticateUser,hasRole(['deputyWarden']),errorWrapper(getSummerVacationFormsForDeputyWardenController))
//get All the greivance data
deputyWardenRouter.get("/grievance",authenticateUser,hasRole(['deputyWarden']),errorWrapper(getGrievancesForDeputyWardenController));

// Fetch all leave forms waiting for Deputy Warden approval by hostel block and floor 
deputyWardenRouter.get("/student_leave", authenticateUser ,hasRole(['deputyWarden']),errorWrapper(getLeaveFormWaitingForApprovalController));

// Approve or decline leave form by Deputy Warden with leave form ID in path
deputyWardenRouter.put("/student_leave/:leave_form_id",authenticateUser,hasRole(['deputyWarden']),errorWrapper(updateLeaveFormApprovalStatusController));

deputyWardenRouter.get("/rooms", authenticateUser,hasRole(['deputyWarden']), errorWrapper(fetchRoomDetailsByBlockAndAcademicYearController));

deputyWardenRouter.get("/vacating_hostel", authenticateUser,hasRole(['deputyWarden']),errorWrapper(getVacatingFormsForDeputyWardenController));

deputyWardenRouter.put("/vacating_hostel/:vacating_hostel_id", authenticateUser,hasRole(['deputyWarden']),errorWrapper(approveVacatingFormByDeputyWardenController));

//RC management
deputyWardenRouter.post("/rc", authenticateUser, hasRole(['deputyWarden']),  errorWrapper(createRCController));
deputyWardenRouter.get("/rc", authenticateUser, hasRole(['deputyWarden']), errorWrapper(getRCsController));
deputyWardenRouter.put("/rc/:rc_id", authenticateUser, hasRole(['deputyWarden']), errorWrapper(updateRCController));
deputyWardenRouter.delete("/rc/:rc_id", authenticateUser, hasRole(['deputyWarden']), errorWrapper(deleteRCController));

deputyWardenRouter.get("/rc/leave", authenticateUser,hasRole(['deputyWarden']), errorWrapper(getRCLeaves))
deputyWardenRouter.put("/rc/leave/:leave_id", authenticateUser, hasRole(['deputyWarden']), errorWrapper(updateLeaveStatusForRC));
//Attendance
deputyWardenRouter.get("/attendance/", authenticateUser, hasRole(['deputyWarden']), errorWrapper(getAllAttendanceController));


export default deputyWardenRouter;
