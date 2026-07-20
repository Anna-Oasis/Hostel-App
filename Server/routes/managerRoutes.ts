// managerRoutes.ts - Manager-related routes for the Hostel App API
// Handles admissions, grievances, and vacating hostel approvals for managers

import { Router } from 'express';
import {
  fetchAdmissionWaitingForApprovalController,
  approveByManagerController,
  fetchAdmissionsApprovedByUser,
  updateApprovalStatusByManagerController,
  fetchApprovedAdmissionsForManager
} from '../controllers/admissionController';
import errorWrapper from "../middleware/errorWrapper";
import {
  resolveGrievanceByManagerController,
  getGrievancesForManagerController
} from '../controllers/grievanceController';
import { authenticateUser, hasRole } from '../middleware/rbacMiddleware';
import {
  approveVacatingFormByManagerController,
  getVacatingFormsForManagerController
} from '../controllers/vacatingHostelController';
import {getDeclarationForOthersController} from '../controllers/declarationController';
import { approveStudentDetailsByManagerController, fetchStudentDetails, fetchStudentDetailsForManagerVerificationController, getStudentDetailsUsingRollNoController } from '../controllers/detailsController';
import { fetchRoomDetailsByAcademicYearController } from '../controllers/roomController';
import { getAdmissionSessionsController } from "../controllers/admissionSessionController";
import { getManagerAttendanceReportController } from "../controllers/managerAttendanceReportController";
import { generateApplicationFormController, generateFeeReceiptController, generateReAdmissionFormController, generateRoomAllotmentFormController } from '../controllers/pdfController';

const managerRouter = Router();

// Admission approval routes
managerRouter.get(
  "/admissions",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(fetchAdmissionWaitingForApprovalController)
);
managerRouter.put(
  "/admissions/:admission_id",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(approveByManagerController)
);
managerRouter.get(
  "/admissions/approvals",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(fetchAdmissionsApprovedByUser)
);

managerRouter.get(
  "/forms/feeReceipt/:addmissionid",
  authenticateUser,
  hasRole(["manager"]),
  errorWrapper(generateFeeReceiptController)
)

managerRouter.get(
  "/forms/application-form/:studentId",
  authenticateUser,
  hasRole(["manager"]),
  errorWrapper(generateApplicationFormController)
)

managerRouter.get(
  "/forms/room-allotment-form/:studentId",
  authenticateUser,
  hasRole(["manager"]),
  errorWrapper(generateRoomAllotmentFormController)
);

managerRouter.get(
  "/forms/re-admission-form/:studentId",
  authenticateUser,
  hasRole(["manager"]),
  errorWrapper(generateReAdmissionFormController)
);

managerRouter.get(
  "/admissions_approved",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(fetchApprovedAdmissionsForManager)
);

// Vacating hostel approval routes
managerRouter.put(
  "/vacating_hostel/:vacating_hostel_id",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(approveVacatingFormByManagerController)
);
managerRouter.get(
  "/vacating_hostel",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(getVacatingFormsForManagerController)
);

// Grievance management routes
managerRouter.put(
  "/grievance/:grievance_id",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(resolveGrievanceByManagerController)
);
managerRouter.get(
  "/grievance",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(getGrievancesForManagerController)
);

//Student details verification route
managerRouter.get(
  "/details",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(fetchStudentDetailsForManagerVerificationController)
);

//Student details  route
managerRouter.get(
  "/getdetails",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(fetchStudentDetails)
);

managerRouter.get(
  "/details/:rollNo",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(getStudentDetailsUsingRollNoController)
);

managerRouter.put(
  "/details/:rollNo",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(approveStudentDetailsByManagerController)
);

//get all types of Latest Declarations  
managerRouter.get("/declaration",
  authenticateUser,
  hasRole(['manager']),
  errorWrapper(getDeclarationForOthersController));

managerRouter.post(
  "/attendance/report",
  authenticateUser,
  hasRole(["manager"]),
  errorWrapper(getManagerAttendanceReportController)
);

//get room details
managerRouter.get(
  "/rooms/:academicYear",
  authenticateUser,
  hasRole(["manager"]),
  errorWrapper(fetchRoomDetailsByAcademicYearController)
);
//get Academic Sessions
managerRouter.get(
  "/admissions/session",
  authenticateUser,
  hasRole(["manager"]),
  errorWrapper(getAdmissionSessionsController)
);

export default managerRouter;

