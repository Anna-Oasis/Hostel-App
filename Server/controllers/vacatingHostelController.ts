import { Response } from "express";
import httpStatus from "http-status";
import { vacatingFormSchema } from "../validation/vacatingHostel.schema";
import {
  approveOrDeclineByDeputyWarden,
  approveOrDeclineByManager,
  createCautionDepositRefund,
  createVacatingHostelForm,
  getVacatingHostelFormsOfStudent,
  getVacatingFormsWaitingForDeputyWarden,
  getVacatingFormsWaitingForManager,
} from "../services/vacatingHostelService";
import {
  getPendingRCApprovals,
  approveOrDeclineByRC,
} from "../services/vacatingHostelService";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../types/roles";
import { cautionDepositSchema } from "../validation/cautionDeposit.schema";
import { getRollNoFromUserId } from "../services/helper";

// export async function createVacatingHostelFormController(req: AuthRequest, res: Response) {
//   const { vacatingForm, cautionDeposit } = req.body;

//   if (!vacatingForm || !cautionDeposit) {
//     throw AppError("Both vacatingForm and cautionDeposit are required", httpStatus.BAD_REQUEST);
//   }

//   const validatedVacatingForm = vacatingFormSchema.parse(vacatingForm);
//   const validatedCautionDeposit = cautionDepositSchema.parse(cautionDeposit);

//   const vacatingData = {
//     ...validatedVacatingForm,
//     vacating_date: validatedVacatingForm.vacating_date.toISOString().split("T")[0],
//     vacating_time: validatedVacatingForm.vacating_time,
//   };

//   const [vacatingRecord] = await createVacatingHostelForm(vacatingData);

//   const cautionData = {
//     ...validatedCautionDeposit,
//     vacating_hostel_id: vacatingRecord.id,
//   };

//   const [refundRecord] = await createCautionDepositRefund(cautionData);

//   res.status(httpStatus.CREATED).json({
//     success: true,
//     message: "Vacating hostel and caution deposit form submitted successfully",
//     data: {
//       vacatingHostel: vacatingRecord,
//       cautionDeposit: refundRecord,
//     },
//   });
// }


export async function getVacatingHostelFormsOfaStudentController(req: AuthRequest, res: Response) {

  if (!req.User || !req.User.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }
  const userId = parseInt(req.User.id);
  const rollNo =await getRollNoFromUserId(userId);
  if (!rollNo) {
    throw AppError("Roll number not found for the user", httpStatus.NOT_FOUND);
  }
  const result = await getVacatingHostelFormsOfStudent(rollNo);

  res.status(httpStatus.OK).json({
    success: true,
    data: result || [],
    count: result?result.length:0,
    message: result && result.length > 0
     ? "Vacating hostel forms fetched successfully"
      : "No vacating hostel forms found for the student",
  });
}

export async function getVacatingFormsForRCController(req: AuthRequest, res: Response) {
  if (!req.User || !req.User.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }

  const rcId = parseInt(req.User.id);
  const forms = await getPendingRCApprovals(rcId);

  res.status(httpStatus.OK).json({
    success: true,
    data: forms || [],
    count: forms ? forms.length:0,
    message: forms && forms.length>0
    ?"Pending vacating forms fetched successfully for RC":
    "No pending forms found for RC",
  });
}

export async function approveVacatingFormByRCController(req: AuthRequest, res: Response) {
  const { vacating_hostel_id, approve, comment } = req.body;

  if (!req.User || !req.User.id) {
    throw AppError("User ID missing", httpStatus.UNAUTHORIZED);
  }

  if (vacating_hostel_id === undefined || typeof approve !== "boolean") {
    throw AppError("vacating_hostel_id and approve are required", httpStatus.BAD_REQUEST);
  }

  const rcUserId = Number(req.User.id);

  const result = await approveOrDeclineByRC(vacating_hostel_id, rcUserId, approve, comment);

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
    message: result.message,
  });
}

export async function getVacatingFormsForManagerController(req: AuthRequest, res: Response) {
  const forms = await getVacatingFormsWaitingForManager();


  res.status(httpStatus.OK).json({
    success: true,
    data: forms || [],
    count: forms?forms.length:0,
    message: forms && forms.length>0 
    ? "Vacating forms waiting for manager approval fetched successfully"
    : "No vacating forms waiting for manager approval",
  });
}


export async function getVacatingFormsForDeputyWardenController(req: AuthRequest, res: Response) {
  const forms = await getVacatingFormsWaitingForDeputyWarden();


res.status(httpStatus.OK).json({
  success: true,
  data: forms || [],
  count: forms ? forms.length : 0,
  message: forms && forms.length > 0 
    ? "Vacating forms waiting for deputy warden approval fetched successfully"
    : "No vacating forms waiting for deputy warden approval",
});
}

export async function approveVacatingFormByDeputyWardenController(req: AuthRequest, res: Response) {
  const { vacating_hostel_id } = req.params;
  const { approve, comment } = req.body;

  if (!req.User || !req.User.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }

  if (!vacating_hostel_id || approve === undefined) {
    throw AppError("Both vacating_hostel_id and approve status are required", httpStatus.BAD_REQUEST);
  }

  if (approve === false && (!comment || comment.trim() === '')) {
    throw AppError("Comment is required when declining a form", httpStatus.BAD_REQUEST);
  }

  const deputyWardenId = parseInt(req.User.id);
  const result = await approveOrDeclineByDeputyWarden(
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

  if (!req.User || !req.User.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }

  if (!vacating_hostel_id || approve === undefined) {
    throw AppError("Both vacating_hostel_id and approve status are required", httpStatus.BAD_REQUEST);
  }

  if (!deductions || !refund_amount || !deduction_details) {
    throw AppError("All caution deposit refund details are required", httpStatus.BAD_REQUEST);
  }

  if (approve === false && (!comment || comment.trim() === '')) {
    throw AppError("Comment is required when declining a form", httpStatus.BAD_REQUEST);
  }

  const managerId = parseInt(req.User.id);
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