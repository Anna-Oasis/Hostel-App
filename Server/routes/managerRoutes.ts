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
} from '../controllers/vactingHostelController';

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

export default managerRouter;


