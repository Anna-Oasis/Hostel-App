import httpStatus from "http-status";
import { Response } from "express";
import { approval_status, rcLeave_status } from "../constants/enum";
import AppError from "../utils/AppError";
import { AuthRequest } from "../types/roles";
import { getRCById } from "../services/rcServices";
import { getRCidfromUserId } from "../services/helper";
import {
  getLeaveFormsToBeApprovedByRcByFloor,
  getLeaveFormByLeaveFormId,
  updateLeaveForm,
  createLeaveFormApproval,
  getLeaveFormsToBeApprovedByDeputyWarden,
  createLeaveForm,
  getLeaveFormApprovals,
} from "../services/leaveServices";
import { LeaveDecisionSchema } from "../validation/leave.validation";
import { leaveFormSchema } from "../validation/leaveform.schema";
import { getRCLeaveToBeApprovedByDeputyWarden, getRCLeaveToBeApprovedByExecutiveWarden, updateRCLeaveStatus } from "../services/rcLeaveService";
import { date } from "drizzle-orm/mysql-core";

export const createLeaveFormFromController = async (
  req: AuthRequest,
  res: Response
) => {
  //validation
  const validatedData = leaveFormSchema.safeParse(req.body);

  if (!validatedData.success) {
    throw AppError(
      validatedData.error.issues.map((issue) => issue.message).join(", "),
      httpStatus.BAD_REQUEST
    );
  }

  const result = await createLeaveForm(validatedData.data);

  res.status(httpStatus.OK).json({
    success: true,
    message: "New Leave Form Created",
    data: result,
  });
};

export const getAllLeaveFormsFromController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const rollNumber = req.params.roll_number;

  if (!rollNumber) {
    throw AppError("Invalid or No Data is passed", httpStatus.BAD_REQUEST);
  }

  const result = await getLeaveFormApprovals(rollNumber);

  if (!result || result.length === 0) {
    res.status(httpStatus.NOT_FOUND).json({
      success: false,
      message: "No Leave Form Exists",
    });
  }

  res.status(httpStatus.FOUND).json({
    success: true,
    message: "All available leave forms are fetched Successfully",
    data: result,
  });
};

// RC: \resident_counsellor\student_leave
// Deputy Warden: \deputy_warden\student_leave

/*
RC: GET - Fetch all student leave forms waiting for RC approval by floor
Deputy Warden: GET - Fetch all leave forms waiting for approval from deputy warden
*/
export const getLeaveFormWaitingForApprovalController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User || !req.User.id || !req.User.role) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const userRole = req.User.role;
  let leave_form: any;

  if (userRole === "rc") {
    const rc_id = await getRCidfromUserId(Number(req.User.id));
    if (!rc_id) {
      throw AppError("RC not found for the user", httpStatus.NOT_FOUND);
    }

    const rc = await getRCById(Number(rc_id));
    if (!rc || rc.length === 0) {
      throw AppError("RC not found", httpStatus.NOT_FOUND);
    }

    if (!rc[0].hostel || !rc[0].floor) {
      throw AppError(
        "Hostel or floor is not assigned to RC",
        httpStatus.NOT_FOUND
      );
    }

    leave_form = await getLeaveFormsToBeApprovedByRcByFloor(
      rc[0].floor,
      rc[0].hostel
    );
  } else if (userRole === "deputyWarden") {
    leave_form = await getLeaveFormsToBeApprovedByDeputyWarden();
  } else {
    throw AppError("Unauthorized user role", httpStatus.UNAUTHORIZED);
  }

  if (!leave_form || leave_form.length === 0) {
    res.status(httpStatus.OK).json({
      success: false,
      data: [],
      message: `No Leave Forms waiting for ${userRole} approval`,
    });
    return;
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: leave_form,
    message: "Fetched Leave forms successfully",
  });
};

/*
PUT - \leave_form_id as path param, approve the leave_form_id by RC and Deputy warden and entry into leave_form_id_approvals (request body will contain approve/decline with comment) 
*/
export const updateLeaveFormApprovalStatusController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { leave_form_id } = req.params;

  if (!leave_form_id || isNaN(Number(leave_form_id))) {
    throw AppError("Invalid or missing Leave Form ID", httpStatus.BAD_REQUEST);
  }

  if (!req.User || !req.User.id || !req.User.role) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const user_id = req.User.id;
  const userRole = req.User.role;
  let updateStatus: string;

  if (userRole === "rc") {
    const rc_id = await getRCidfromUserId(Number(req.User.id));
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
    status: validated.approve? updateStatus :approval_status.declined,
    updated_at: new Date(),
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: {
      leaveForm: updatedLeaveForm,
      leaveFormApprovalsapproval: approvalResult[0],
    },
    message: "Leave form status updated successfully",
  });
};
