import { Request, Response } from "express";
import { checkRoom, setStudentinRoom, updateStudentRoomNumber} from "../services/roomServices";
import {
  createAdmissionApproval, 
  updateAdmissionStatus,
  getRollNumberByAdmissionId,
  getAdmissionByAdmissionId,
  getAdmissionsByStatus,
  getAcademicYearByAdmissionId
} from "../services/admissionServices"
import { deputyWardenDecisionSchema } from "../validation/deputy-warden.schema";
import { approval_status } from "../constants/enum";
import AppError from "../utils/AppError";
import httpStatus from "http-status";

// \deputy_warden\admissions: GET - Fetch all admissions waiting for deputy warden approval 
export const getAdmissionWaitingForApprovalByDeputyWardenController = async (
  req: Request, 
  res: Response
): Promise<void> => {
  const admissions = await getAdmissionsByStatus(approval_status.rc);
  
  if (!admissions || admissions.length === 0) {
    throw AppError("No admissions waiting for deputy warden approval", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({ 
    success: true, 
    data: admissions,
    message: "Admissions fetched successfully",
  });
};

// \deputy_warden\admissions: PUT – use \admission_id to approve or decline by deputy warden, entry into admission_approval table with comment(if declined) (The request body will contain the approval, student user_id, room and floor) 
export const updateApprovalStatusByDeputyWardenController = async (
  req: Request, 
  res: Response
): Promise<void> => {
  const { admission_id } = req.params;
  const validated = deputyWardenDecisionSchema.parse(req.body);

  // If status is false, comment is required
  if (validated.approve === false && (!validated.comment || validated.comment.trim() === '')) {
    throw AppError(
      "Comment is required when declining an admission", httpStatus.BAD_REQUEST
    );
  }
  
  // Common approval creation
  const approvalResult = await createAdmissionApproval({
    admission_id: Number(admission_id),
    user_id: validated.student_user_id,
    approve: validated.approve,
    comment: validated.comment,
  });

  if (!approvalResult) {
    throw AppError("Failed to create admission approval", httpStatus.INTERNAL_SERVER_ERROR);
  }

  const admission = await getAdmissionByAdmissionId(Number(admission_id));
  if (!admission || admission.length === 0) {
    throw AppError("Admission not found for the provided ID", httpStatus.NOT_FOUND);
  }

  const rollNo = await getRollNumberByAdmissionId(Number(admission_id));
  const hostelBlock = admission[0].hostelBlock;
  const currentYear = await getAcademicYearByAdmissionId(Number(admission_id));

  if (validated.approve) {
    // Approval logic
    const status = approval_status.deputyWarden;
    
    // Update admission status
    const admissionUpdate = await updateAdmissionStatus({
      admission_id: Number(admission_id),
      status
    });

    if (!admissionUpdate) {
      throw AppError("Failed to update admission status", httpStatus.INTERNAL_SERVER_ERROR);
    }
  } else {
    // Denial logic
    const status = approval_status.declined;

    // Update admission status
    const admissionUpdate = await updateAdmissionStatus({
      admission_id: Number(admission_id),
      status
    });

    if (!admissionUpdate) {
      throw AppError("Failed to update admission status", httpStatus.INTERNAL_SERVER_ERROR);
    }

    // Clear student room number
    const studentUpdate = await updateStudentRoomNumber(rollNo, null);

    if (!studentUpdate) {
      throw AppError("Failed to clear student room assignment", httpStatus.INTERNAL_SERVER_ERROR);
    }

    // Only proceed with room removal if room number was provided
      if (validated.room) {
        const room = await checkRoom(
          validated.room,
          hostelBlock,
          currentYear
      );
      
      if (!room) {
        throw AppError("Room Not Found!", httpStatus.NOT_FOUND);
      }

      // Check if student is in this room
      if (!room.rollNo || !room.rollNo.includes(rollNo)) {
        throw new Error("Student is not assigned to this room.");
      }

      // Remove student from room
      const updatedRollNos = room.rollNo.filter(r => r !== rollNo);
      
      await setStudentinRoom(
        updatedRollNos,
        validated.room, 
        hostelBlock,
        currentYear
      );
    }
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: validated.approve 
      ? "Admission approved successfully" 
      : "Admission declined successfully",
  });
};