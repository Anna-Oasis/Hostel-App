import httpStatus from "http-status";
import {
  createAdmission,
  getAdmissionByAdmissionId,
  getAdmissionByRollNumber,
  updateAdmission,
  checkForAdmissionByRollNumberAndAcademicYear,
  getAdmissionsByStatus,
  createAdmissionApproval,
  getAdmissionsToBeApprovedByRcByHostelBlock,
} from "../services/admissionServices";
import { Request, Response } from "express";
import { createAdmissionSchema } from "../validation/admission.schema";
import { approval_status } from "../constants/enum";
import AppError from "../utils/AppError";
import { managerAdmissionDecisionSchema } from "../validation/manager.schema";
import { AuthRequest } from "../types/roles";
import { getAdmissionsApprovedByUser } from "../services/admissionServices";
import {
  updateAdmissionStatus,
  getRollNumberByAdmissionId,
  getAcademicYearByAdmissionId,
} from "../services/admissionServices";
import { LeaveDecisionSchema } from "../validation/leave.validation";
import {
  checkRoom,
  setStudentinRoom,
  updateStudentRoomNumber,
} from "../services/roomServices";
import { ROOM_SIZE } from "../constants/values";
import { getRCById } from "../services/rcServices";
import { getRCidfromUserId } from "../services/helper";
import { wardenDecisionSchema } from "../validation/warden.schema";
import { getLeaveFormsToBeApprovedByRcByFloor, getLeaveFormByLeaveFormId, updateLeaveForm, createLeaveFormApproval, getLeaveFormsToBeApprovedByDeputyWarden } from "../services/leaveServices";
import { leaveFormModel } from "../models/leaveForm";
import { leaveFormApprovalsModel } from "../models/leaveFormApprovals";

export const getLeaveFormWaitingForApprovalController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.user || !req.user.id || !req.user.role) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const userRole = req.user.role;
  let leave_form: any; 

  if (userRole === "rc") {
    const rc_id = await getRCidfromUserId(Number(req.user.id));
    if (!rc_id) {
      throw AppError("RC not found for the user", httpStatus.NOT_FOUND);
    }

    const rc = await getRCById(Number(rc_id));
    if (!rc || rc.length === 0) {
      throw AppError("RC not found", httpStatus.NOT_FOUND);
    }

    leave_form = await getLeaveFormsToBeApprovedByRcByFloor(
      rc[0].floor, rc[0].hostel
    );

  } 
  else if (userRole === "deputyWarden") {
    leave_form = await getLeaveFormsToBeApprovedByDeputyWarden();
  } 
  else {
    throw AppError("Unauthorized user role", httpStatus.UNAUTHORIZED);
  }

  if (!leave_form) {
    throw AppError(
      `No Leave Forms waiting for ${userRole} approval`,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: leave_form,
    message: "Fetched Leave forms successfully",
  });
};


export const updateLeaveFormApprovalStatusController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { leave_form_id } = req.params;

  if (!leave_form_id || isNaN(Number(leave_form_id))) {
    throw AppError("Invalid or missing Leave Form ID", httpStatus.BAD_REQUEST);
  }

  if (!req.user || !req.user.id || !req.user.role) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const user_id=req.user.id;
  const userRole = req.user.role;
  let updateStatus: string;

  if (userRole === "rc") {
    const rc_id = await getRCidfromUserId(Number(req.user.id));
    if (!rc_id) {
      throw AppError("RC not found for the user", httpStatus.NOT_FOUND);
    }

    const rc = await getRCById(Number(rc_id));
    if (!rc || rc.length === 0) {
      throw AppError("RC not found", httpStatus.NOT_FOUND);
    }

    updateStatus = approval_status.rc;
  } else if (userRole === "deputyWarden") {
    updateStatus = approval_status.deputyWarden;
  } else {
    throw AppError("Unauthorized user role", httpStatus.UNAUTHORIZED);
  }


  const validated = LeaveDecisionSchema.parse(req.body);
  if (
    validated.approve === false &&
    (!validated.comment || validated.comment.trim() === "")
  ) {
    throw AppError(
      "Comment is required when declining a leave form",
      httpStatus.BAD_REQUEST
    );
  }

  const existingleaveForm = await getLeaveFormByLeaveFormId(
    Number(leave_form_id)
  );

  if (existingleaveForm.length === 0) {
    throw AppError(
      "leave form not found for the provided ID",
      httpStatus.NOT_FOUND
    );
  }

  const approvalResult = await createLeaveFormApproval({
    leave_form_id: Number(leave_form_id),
    user_id: Number(user_id),
    approve: validated.approve,
    comment: validated.comment,
  });

  if (!approvalResult) {
    throw AppError(
      "Failed to create leave form approval",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  const updatedLeaveForm = await updateLeaveForm(Number(leave_form_id), {
    status: updateStatus,
    updated_at: new Date(),
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: {
      leaveForm: updatedLeaveForm,
      leaveFormApprovalsapproval: approvalResult[0],
    },
    message: "Admission status updated successfully",
  });
};

