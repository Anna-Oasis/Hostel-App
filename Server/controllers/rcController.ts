import { Request, Response } from "express";
import {
  getRCById,
  getAdmissionsByHostelBlock,
  getGrievances,
  updateGrievanceApprovalStatus
} from "../services/rcServices";
import {
  createAdmissionApproval, 
  updateAdmissionStatus,
  getRollNumberByAdmissionId,
  getAdmissionByAdmissionId 
} from "../services/admissionServices"
import { rcAdmissionDecisionSchema, rcGrievanceDecisionSchema } from "../validation/rc.schema";
import { approval_status } from "../constants/enum";
import httpStatus from "http-status";
import AppError from "../utils/AppError";
import { checkRoom, removeStudentFromRoom, updateStudentRoomNumber } from "../services/roomServices";
import { ROOM_SIZE } from "../constants/values";

export const viewAdmissionsByRCController = async (req: Request, res: Response): Promise<void> => {
  const { rc_id } = req.params;

  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const admissions = await getAdmissionsByHostelBlock(rc[0].hostel);
  if (!admissions) {
    throw AppError("Failed to fetch admissions", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({ 
    success: true, 
    data: admissions,
    message: "Fetched Admissions successfully", 
  });
};

export const approveOrDeclineAdmissionByRCController = async (
  req: Request, 
  res: Response
): Promise<void> => {
  const { admission_id } = req.params;
  const validated = rcAdmissionDecisionSchema.parse(req.body);
  
  // Common approval creation
  const approvalResult = await createAdmissionApproval({
    admission_id: Number(admission_id),
    user_id: validated.rc_id,
    approve: validated.approve,
    comment: validated.comment,
  });

  if (!approvalResult) {
    throw AppError("Failed to create admission approval", httpStatus.INTERNAL_SERVER_ERROR);
  }

  const admission = await getAdmissionByAdmissionId(Number(admission_id));
  if (!admission || admission.length === 0) {
    throw AppError("Admission not found", httpStatus.NOT_FOUND);
  }

  const rollNo = await getRollNumberByAdmissionId(Number(admission_id));
  const hostelBlock = admission[0].hostelBlock;
  const currentYear = new Date().getFullYear().toString();

  if (validated.approve) {
    // Approval logic
    const status = approval_status.rc;
    
    // Check room capacity before approval
    const room = await checkRoom(
      validated.room,
      hostelBlock,
      currentYear
    );
    if (!room) {
      throw AppError("Room Not Found!", httpStatus.NOT_FOUND);
    }

    // Check if room has space (max 2 students)
    if (room.rollNo && room.rollNo.length >= ROOM_SIZE) {
      throw AppError("Room is already full (2 students)", httpStatus.BAD_REQUEST);
    }

    // Update admission status
    const admissionUpdate = await updateAdmissionStatus({
      admission_id: Number(admission_id),
      status
    });

    if (!admissionUpdate) {
      throw AppError("Failed to update admission status", httpStatus.INTERNAL_SERVER_ERROR);
    }

    // Update student room number
    const studentUpdate = await updateStudentRoomNumber(
      rollNo,
      validated.room
    );

    if (!studentUpdate) {
      throw AppError("Failed to update student room", httpStatus.INTERNAL_SERVER_ERROR);
    }
  } else {
    // Denial logic
    const status = approval_status.declined;

    const room = await checkRoom(validated.room, hostelBlock, currentYear);
  
     if (!room) {
      throw AppError("Room Not Found!", httpStatus.NOT_FOUND);
    }

    // Check if student is in this room
    if (!room.rollNo || !room.rollNo.includes(rollNo)) {
      throw new Error("Student is not assigned to this room");
    }

    // Remove student from room
    const updatedRollNos = room.rollNo.filter(r => r !== rollNo);
    
      await removeStudentFromRoom(
        updatedRollNos,
        validated.room,
        hostelBlock,
        currentYear
      );

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
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: validated.approve 
      ? "Admission approved successfully" 
      : "Admission declined successfully",
  });
};

export const viewGrievancesByRCController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { rc_id } = req.params;

  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const grievances = await getGrievances(rc[0].hostel, rc[0].floor);
  if (!grievances) {
    throw AppError("Failed to fetch grievances", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({ 
    success: true, 
    data: grievances,
    message: "Fetched Grievances successfully",
  });
};

export const approveOrDeclineGrievancesByRCController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { rc_id } = req.params;

  const validated = rcGrievanceDecisionSchema.parse(req.body);
  
  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const updateResult = await updateGrievanceApprovalStatus({
    grievance_id: validated.grievances_id,
    rc_approval: validated.approve
  });

  if (!updateResult) {
    throw AppError("Failed to update grievance status", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Grievance approval submitted successfully",
  });
};



