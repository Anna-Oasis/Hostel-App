import { Router } from "express";
import {fetchAdmissionsApprovedByUser , updateApprovalStatusByRCController,getAdmissionWaitingForApprovalByRCController} from "../controllers/admissionController";
import { approveOrDeclineGrievancesByRCController, viewGrievancesByRCController } from "../controllers/grievanceController";
import errorWrapper from "../middleware/errorWrapper";
import { authenticateUser,hasRole } from '../middleware/rbacMiddleware';
import {approveSummerVacationFormByRCController,getSummerVacationFormsForRCController} from '../controllers/summerVacationController';
import {
  getVacatingFormsForRCController,
  approveVacatingFormByRCController
} from "../controllers/vactingHostelController";
import { getLeaveFormWaitingForApprovalController, updateLeaveFormApprovalStatusController } from "../controllers/leaveController";
import { fetchRoomDetailsByBlockAndAcademicYearController } from "../controllers/roomController";
import { fetchStudentDetailsForRcController } from "../controllers/studentController";
import { createAttendanceByRcController, getAttendanceByRcController } from "../controllers/attendanceController";



const rcRouter = Router();

// Fetch all admissions waiting for RC approval by hostel block
rcRouter.get("/admissions",authenticateUser,hasRole(["rc"]),errorWrapper( getAdmissionWaitingForApprovalByRCController));

// Approve or decline admission by RC with admission ID in path
rcRouter.put("/admissions/:admission_id",authenticateUser,hasRole(["rc"]),errorWrapper(updateApprovalStatusByRCController));

// Fetch all grievances waiting for RC approval by hostel block and floor
rcRouter.get("/grievance/:rc_id",authenticateUser,hasRole(["rc"]), errorWrapper(viewGrievancesByRCController));

// Approve or decline grievance by RC with grievance ID in body
rcRouter.put("/grievance/:rc_id", authenticateUser,hasRole(["rc"]), errorWrapper(approveOrDeclineGrievancesByRCController));


// Fetch the approval data reviewd by a particular RC
rcRouter.get("/admissions/approvals",authenticateUser ,hasRole(['rc']),errorWrapper(fetchAdmissionsApprovedByUser));

// rcRouter.put("/summer_vacation/:summer_vacation_id",authenticateUser,hasRole(['rc']),errorWrapper(approveSummerVacationFormByRCController))

//get all the summer vacation forms for RC
rcRouter.get("/summer_vacation",authenticateUser,hasRole(['rc']),errorWrapper(getSummerVacationFormsForRCController));

//approve or decline summer vacation form by RC
rcRouter.put("/summer_vacation/:summer_vacation_id",authenticateUser,hasRole(['rc']),errorWrapper(approveSummerVacationFormByRCController));
// Fetch all leave forms waiting for RC approval by hostel block and floor 
rcRouter.get("/student_leave", authenticateUser ,hasRole(['rc']),errorWrapper(getLeaveFormWaitingForApprovalController));

// Approve or decline leave form by RC with leave form ID in path
rcRouter.put("/student_leave/:leave_form_id",authenticateUser,hasRole(['rc']),errorWrapper(updateLeaveFormApprovalStatusController));

// Fetch all room details by hostel block and academic year 
rcRouter.get("/rooms", authenticateUser,hasRole(['rc']), errorWrapper(fetchRoomDetailsByBlockAndAcademicYearController));

// Fetch all student and room details by hostel block and floor 
rcRouter.get("/students", authenticateUser,hasRole(['rc']), errorWrapper(fetchStudentDetailsForRcController));

rcRouter.get("/vacating_hostel",authenticateUser ,hasRole(['rc']),errorWrapper(getVacatingFormsForRCController));
rcRouter.put("/vacating_hostel",authenticateUser ,hasRole(['rc']),errorWrapper(approveVacatingFormByRCController));


rcRouter.get("/attendance/:rc_id",authenticateUser,hasRole(['rc']),errorWrapper(getAttendanceByRcController));
rcRouter.post("/attendance/:rc_id",authenticateUser,hasRole(['rc']),errorWrapper(createAttendanceByRcController));

export default rcRouter;

