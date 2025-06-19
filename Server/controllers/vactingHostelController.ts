import { Request, Response } from "express";
import httpStatus from "http-status";
import { vacatingFormSchema } from "../validation/vacatingHostel.schema";
import {
  approveOrDeclineByManager,
  createCautionDepositRefund,
  createVacatingHostelForm,
  getAllVacatingHostelForms,
  getVacatingFormsWaitingForDeputyWarden,
  getVacatingFormsWaitingForManager,
} from "../services/vacatingHostelService";
import {
  getPendingRCApprovals,
  approveOrDeclineByRC,
} from "../services/vacatingHostelService";
import { approval_status } from "../constants/enum";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../types/roles";
import { cautionDepositSchema } from "../validation/cautionDeposit.schema";

export async function createVacatingHostelFormController(req: AuthRequest, res: Response) {
  const { vacatingForm, cautionDeposit } = req.body;

  if (!vacatingForm || !cautionDeposit) {
    throw AppError("Both vacatingForm and cautionDeposit are required", httpStatus.BAD_REQUEST);
  }

  const validatedVacatingForm = vacatingFormSchema.parse(vacatingForm);
  const validatedCautionDeposit = cautionDepositSchema.parse(cautionDeposit);

  const vacatingData = {
    ...validatedVacatingForm,
    vacating_date: validatedVacatingForm.vacating_date.toISOString().split("T")[0],
    vacating_time: validatedVacatingForm.vacating_time,
  };

  const [vacatingRecord] = await createVacatingHostelForm(vacatingData);

  const cautionData = {
    ...validatedCautionDeposit,
    vacating_hostel_id: vacatingRecord.id,
  };

  const [refundRecord] = await createCautionDepositRefund(cautionData);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Vacating hostel and caution deposit form submitted successfully",
    data: {
      vacatingHostel: vacatingRecord,
      cautionDeposit: refundRecord,
    },
  });
}


export async function getAllVacatingHostelFormsController(req: AuthRequest, res: Response) {
  const result = await getAllVacatingHostelForms();

  if (!result || result.length === 0) {
    throw AppError("No vacating hostel forms found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: "Vacating hostel forms fetched successfully",
  });
}

export async function getVacatingFormsForRCController(req: AuthRequest, res: Response) {
  if (!req.user || !req.user.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }

  const rcId = parseInt(req.user.id);
  const forms = await getPendingRCApprovals(rcId);

  if (!forms || forms.length === 0) {
    throw AppError("No pending forms found for RC", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: forms,
    message: "Pending vacating forms fetched successfully for RC",
  });
}

export async function approveVacatingFormByRCController(req: AuthRequest, res: Response) {
  const { vacating_hostel_id, approve } = req.body;

  if (!req.user || !req.user.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }

  if (!vacating_hostel_id || approve === undefined) {
    throw AppError("Both vacating_hostel_id and approve status are required", httpStatus.BAD_REQUEST);
  }

  const rcId = parseInt(req.user.id);
  const result = await approveOrDeclineByRC(vacating_hostel_id, rcId, approve);

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: `Form ${approve ? "approved" : "declined"} successfully`,
  });
}

export async function getVacatingFormsForManagerController(req: AuthRequest, res: Response) {
  const forms = await getVacatingFormsWaitingForManager();

  if (!forms || forms.length === 0) {
    throw AppError("No vacating forms waiting for manager approval", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: forms,
    count: forms.length,
    message: "Vacating forms waiting for manager approval fetched successfully",
  });
}


export async function getVacatingFormsForDeputyWardenController(req: AuthRequest, res: Response) {
  const forms = await getVacatingFormsWaitingForDeputyWarden();

  if (!forms || forms.length === 0) {
    throw AppError("No vacating forms waiting for deputy warden approval", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: forms,
    count: forms.length,
    message: "Vacating forms waiting for deputy warden approval fetched successfully",
  });
}

export async function approveVacatingFormByDeputyWardenController(req: AuthRequest, res: Response) {
  const { vacating_hostel_id } = req.params;
  const { approve, comment } = req.body;

  if (!req.user || !req.user.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }

  if (!vacating_hostel_id || approve === undefined) {
    throw AppError("Both vacating_hostel_id and approve status are required", httpStatus.BAD_REQUEST);
  }

  // If declining, comment is required
  if (approve === false && (!comment || comment.trim() === '')) {
    throw AppError("Comment is required when declining a form", httpStatus.BAD_REQUEST);
  }

  const deputyWardenId = parseInt(req.user.id);
  const result = await approveOrDeclineByRC(
    parseInt(vacating_hostel_id), 
    deputyWardenId, 
    approve, 
    comment
  );

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: `Form ${approve ? "approved" : "declined"} successfully by Deputy Warden`,
  });
}

export async function approveVacatingFormByManagerController(req: AuthRequest, res: Response) {
  const { vacating_hostel_id } = req.params;
  const { approve, comment, deductions, refund_amount, deduction_details } = req.body;

  if (!req.user || !req.user.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }

  if (!vacating_hostel_id || approve === undefined) {
    throw AppError("Both vacating_hostel_id and approve status are required", httpStatus.BAD_REQUEST);
  }

  if (!deductions || !refund_amount || !deduction_details) {
    throw AppError("All caution deposit refund details are required", httpStatus.BAD_REQUEST);
  }

  // If declining, comment is required
  if (approve === false && (!comment || comment.trim() === '')) {
    throw AppError("Comment is required when declining a form", httpStatus.BAD_REQUEST);
  }

  const managerId = parseInt(req.user.id);
  const result = await approveOrDeclineByManager(
    parseInt(vacating_hostel_id), 
    managerId, 
    approve, 
    comment,
    {
      deductions,
      refund_amount,
      deduction_details
    }
  );

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: `Form ${approve ? "approved" : "declined"} successfully by Manager`,
  });
}