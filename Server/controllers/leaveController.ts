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
import { rcLeaveDecisionSchema } from "../validation/rc.schema";
import {
  checkRoom,
  setStudentinRoom,
  updateStudentRoomNumber,
} from "../services/roomServices";
import { ROOM_SIZE } from "../constants/values";
import { getRCById } from "../services/rcServices";
import { getRCidfromUserId } from "../services/helper";
import { wardenDecisionSchema } from "../validation/warden.schema";
import { getLeaveFormsToBeApprovedByRcByFloor, getLeaveFormByLeaveFormId, updateLeaveForm, createLeaveFormApproval } from "../services/leaveServices";
import { leaveFormModel } from "../models/leaveForm";
import { leaveFormApprovalsModel } from "../models/leaveFormApprovals";

export const getLeaveFormWaitingForApprovalByRCController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.user || !req.user.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }

  const rc_id = await getRCidfromUserId(Number(req.user.id));
  if (!rc_id) {
    throw AppError("RC not found for the user", httpStatus.NOT_FOUND);
  }

  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const leave_form = await getLeaveFormsToBeApprovedByRcByFloor(
    rc[0].floor, rc[0].hostel
  );

  if (!leave_form) {
    throw AppError(
      "No Leave Forms waiting for RC approval",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: leave_form,
    message: "Fetched Leave forms successfully",
  });
};

export const updateLeaveFormApprovalStatusByRCController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
    if (!req.user || !req.user.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
    }
  
    const rc_id = await getRCidfromUserId(Number(req.user.id));
    if (!rc_id) {
      throw AppError("RC not found for the user", httpStatus.NOT_FOUND);
    }
    const rc = await getRCById(Number(rc_id));
    if (!rc || rc.length === 0) {
      throw AppError("RC not found", httpStatus.NOT_FOUND);
    }
  const validated = rcLeaveDecisionSchema.parse(req.body);
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
    Number(validated.leaveForm_id)
  );

  if (existingleaveForm.length === 0) {
    throw AppError(
      "leave form not found for the provided ID",
      httpStatus.NOT_FOUND
    );
  }

  const updatedLeaveForm = await updateLeaveForm(Number(validated.leaveForm_id), {
    status: approval_status.rc,
    updated_at: new Date(),
  });

  const approvalResult = await createLeaveFormApproval({
    leave_form_id: validated.leaveForm_id,
    user_id: Number(rc_id),
    approve: validated.approve,
    comment: validated.comment,
  });

  if (!approvalResult) {
    throw AppError(
      "Failed to create leave form approval",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: {
      leaveForm: updatedLeaveForm,
      leaveFormApprovalsapproval: approvalResult[0],
    },
    message: "Admission status updated successfully",
  });
};