// managerRoutes.ts - Manager-related routes for the Hostel App API
// Handles admissions, grievances, and vacating hostel approvals for managers

import { Router } from 'express';
import {
  fetchAdmissionWaitingForApprovalController,
  approveByManagerController,
  fetchAdmissionsApprovedByUser
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
import { approveStudentDetailsByManagerController, fetchStudentDetailsForManagerVerificationController, getStudentDetailsUsingRollNoController } from '../controllers/detailsController';

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
export default managerRouter;


