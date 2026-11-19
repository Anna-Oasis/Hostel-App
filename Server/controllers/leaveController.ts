import httpStatus from "http-status";
import { Response } from "express";
import { studentLeaveApprovalStatus } from "../constants/enum";
import AppError from "../utils/AppError";
import { AuthRequest } from "../types/roles";
import {  getAllRCDetailsServiceByFloor, getRCById, getRCByUserId } from "../services/rcServices";
import { getRollNoFromUserId } from "../services/helper";
import {
  getLeaveFormsToBeApprovedByRcByFloor,
  getLeaveFormByLeaveFormId,
  updateLeaveForm,
  createLeaveFormApproval,
  getLeaveFormsToBeApprovedByDeputyWarden,
  createLeaveForm,
  getLeaveFormsByRollNo,
  getApprovedLeavesByRc,
  getApprovedLeavesByDeputyWarden,
} from "../services/leaveServices";
import { leaveFormSchema, LeaveDecisionSchema } from "../validation/leaveform.schema";
import { getDeputyWardenBlockByUserId, getDeputyWardenByBlock } from "../services/dwServices";
import { findStudentByRollNo } from "../services/detailsService";
import { sendMail } from "../services/emailServices";
import { dwLeaveNotificationMessage, parentLeaveNotificationMessage, rcLeaveNotificationMessage, studentLeaveNotificationMessage } from "../services/emailMessageServicesForLeave";

export const createLeaveFormController = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.User) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  //const rollNo = req.params.roll_number;
  const rollNo = await getRollNoFromUserId(Number(req.User.id));
  if (!rollNo) {
    throw AppError("Roll number not found for user", httpStatus.NOT_FOUND);
  }

  const validated= leaveFormSchema.parse(req.body);

  const from = new Date(validated.from_date);
  const to = new Date(validated.to_date);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    throw AppError("Invalid date format", httpStatus.BAD_REQUEST);
  }

  if (to < from) {
    throw AppError(
      "`to_date` must be the same as or after `from_date`",
      httpStatus.BAD_REQUEST
    );
  }

  const validatedData = {
    ...validated,
    roll_number: rollNo,
  };

  const result = await createLeaveForm(validatedData);

  if(!result){
    throw AppError(
      "Failed to create leave form",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  const details = await findStudentByRollNo(rollNo);
  //Mail services
  if (details.length > 0 && details[0].floor && details[0].hostelBlock) {
    const floorRcs = await getAllRCDetailsServiceByFloor(details[0].floor, details[0].hostelBlock);

    await Promise.all(
      floorRcs.map((rc) => {
        const { subject, message } = rcLeaveNotificationMessage({
          student: details[0],
          rcName: rc.name,
        });

        return sendMail(rc.email, subject, message);
      })
    );
  }
  
  res.status(httpStatus.CREATED).json({
    success: true,
    data: result,
    count:result.length,
    message: "New Leave Form Created successfully",
  });
};

export const getAllLeaveFormsByRollNoController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const rollNo = req.params.roll_number as string;
  //const rollNo = await getRollNoFromUserId(Number(req.User.id));

  if (!rollNo) {
    throw AppError("Roll number not found for user", httpStatus.NOT_FOUND);
  }

  const result = await getLeaveFormsByRollNo(rollNo);

  res.status(httpStatus.OK).json({
    success: true,
    data: result || [],
    count:result ? result.length : 0,
    message:result && result.length > 0 
    ? "All available leave forms are fetched Successfully"
    :  "No Leave Form Exists",
  });
};

export const getLeaveFormWaitingForApprovalController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const userRole = req.User.role;
  let result: any;

  if (userRole === "rc") {
    const rc = await getRCByUserId(Number(req.User.id));
    // console.log("RC:", rc);

    if (!rc || rc.length === 0) {
      throw AppError("RC not found", httpStatus.NOT_FOUND);
    }

    if (rc[0].hostel == null || rc[0].floor == null) {
      throw AppError("RC hostel or floor information is missing", httpStatus.INTERNAL_SERVER_ERROR);
    }

    result = await getLeaveFormsToBeApprovedByRcByFloor(
      rc[0].floor,
      rc[0].hostel
    );

    if(rc[0].alternatingToRCId !== null){
      const alterRC = await getRCById(Number(rc[0].alternatingToRCId))
      if (alterRC.length > 0) {
          const alternateLeaves = await getLeaveFormsToBeApprovedByRcByFloor(
            alterRC[0].floor,
            alterRC[0].hostel
          );

          result = [...result, ...alternateLeaves];
        }
    }
  } else if (userRole === "deputyWarden") {
    const block = await getDeputyWardenBlockByUserId(Number(req.User.id))
    result = await getLeaveFormsToBeApprovedByDeputyWarden(block);
  } else {
    throw AppError("Unauthorized user role", httpStatus.UNAUTHORIZED);
  }

   res.status(httpStatus.OK).json({
    success: true,
    data: result || [],
    count:result ? result.length : 0,
    message:result && result.length > 0 
    ? "All available leave forms are fetched Successfully"
    :  `No Leave Forms waiting for ${userRole} approval`,
  });
};

export const getApprovedLeaves = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const userRole = req.User.role;
  let result: any;

  if (userRole === "rc") {
    const rc = await getRCByUserId(Number(req.User.id));
    // console.log("RC:", rc);

    if (!rc || rc.length === 0) {
      throw AppError("RC not found", httpStatus.NOT_FOUND);
    }

    if (rc[0].hostel == null || rc[0].floor == null) {
      throw AppError("RC hostel or floor information is missing", httpStatus.INTERNAL_SERVER_ERROR);
    }

    result = await getApprovedLeavesByRc(
      rc[0].floor,
      rc[0].hostel
    );
  } else if (userRole === "deputyWarden") {
    const block = await getDeputyWardenBlockByUserId(Number(req.User.id))
    result = await getApprovedLeavesByDeputyWarden(block);
  } else {
    throw AppError("Unauthorized user role", httpStatus.UNAUTHORIZED);
  }

   res.status(httpStatus.OK).json({
    success: true,
    data: result || [],
    count:result ? result.length : 0,
    message:result && result.length > 0 
    ? "All available leave forms are fetched Successfully"
    :  `No Leave Forms approved by ${userRole}`,
  });
};
export const updateLeaveFormApprovalStatusController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {

  if (!req.User) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const user_id = req.User.id;
  const userRole = req.User.role;
  let updateStatus: string;

  if (userRole === "rc") {
   
    const rc = await getRCByUserId(Number(req.User.id));
    if (!rc || rc.length === 0) {
      throw AppError("RC not found", httpStatus.NOT_FOUND);
    }

    updateStatus = studentLeaveApprovalStatus.RC;
  } else if (userRole === "deputyWarden") {
    updateStatus = studentLeaveApprovalStatus.DEPUTYWARDEN;
  } else {
    throw AppError("Unauthorized user role", httpStatus.UNAUTHORIZED);
  }

  const { leave_form_id } = req.params;

  if (!leave_form_id || isNaN(Number(leave_form_id))) {
    throw AppError("Invalid or missing Leave Form ID", httpStatus.BAD_REQUEST);
  }

  const existingleaveForm = await getLeaveFormByLeaveFormId(
    Number(leave_form_id)
  );

  if (existingleaveForm.length === 0) {
    throw AppError(
      "Leave form not found for the provided ID",
      httpStatus.NOT_FOUND
    );
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
    status: validated.approve? updateStatus : studentLeaveApprovalStatus.DECLINED,
    updated_at: new Date(),
  });

  if (!updatedLeaveForm) {
    throw AppError(
      "Failed to update leave form",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  const details = await findStudentByRollNo(existingleaveForm[0].roll_number);
  
  //Mail-related code

  if(validated.approve){
    //Approved by RC
    if(req.User.role === "rc"){
      if(details[0].hostelBlock){
        const deputyWardens = await getDeputyWardenByBlock(details[0].hostelBlock)
            await Promise.all(
              deputyWardens.map((dw) => {
                const { subject, message } = dwLeaveNotificationMessage({
                  student: details[0],
                  dwName: dw.name,
                });

                return sendMail(dw.email, subject, message);
              })
            );
      }
    }
    //Approved by DeputyWarden
    else if(req.User.role === "deputyWarden"){
      const { subject, message } = studentLeaveNotificationMessage({
        student: details[0],
        status: validated.approve,
        role: "Deputy Warden",
        leave: existingleaveForm[0],
      });
      await sendMail(details[0].email, subject, message)

      const {parentSubject, parentMessage} = parentLeaveNotificationMessage({
          student : details[0], 
          leave : existingleaveForm[0]
      })

      if(details[0].fatherEmail) await sendMail(details[0].fatherEmail, parentSubject, parentMessage)
      if(details[0].motherEmail) await sendMail(details[0].motherEmail, parentSubject, parentMessage)
    }
  }
  else{

    //Rejected Message
    const { subject, message } = studentLeaveNotificationMessage({
        student: details[0],
        status: validated.approve,
        role: req.User.role === "deputyWarden" ? "Deputy Warden" : "RC",
        leave: existingleaveForm[0],
      });
      await sendMail(details[0].email, subject, message)
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: {
      leaveForm: updatedLeaveForm,
      leaveFormApprovalsapproval: approvalResult[0],
    },
    message: "Leave form status updated successfully",
  });
};
