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
  getAdmissionByAdmissionId,
  getAcademicYearByAdmissionId
} from "../services/admissionServices";
import { 
  rcAdmissionDecisionSchema, 
  rcGrievanceDecisionSchema 
} from "../validation/rc.schema";
import { approval_status } from "../constants/enum";
import httpStatus from "http-status";
import AppError from "../utils/AppError";
import { 
  checkRoom, 
  setStudentinRoom, 
  updateStudentRoomNumber 
} from "../services/roomServices";
import { ROOM_SIZE } from "../constants/values";
import { getAdmissionsApprovedByRC } from "../services/rcAdmissionApprovalService";
import { rcExists } from "../services/rcAdmissionApprovalService";

// \resident_counsellor\admissions: GET – \rc_id as path param, Fetch all admissions waiting for RC approval belonging to the hostel block of the rc
export const getAdmissionWaitingForApprovalByRCController = async (
  req: Request, 
  res: Response
): Promise<void> => {
  const { rc_id } = req.params;
  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const admissions = await getAdmissionsByHostelBlock(rc[0].hostel);
  if (!admissions) {
    throw AppError("No admissions waiting for RC approval", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({ 
    success: true, 
    data: admissions,
    message: "Fetched Admissions successfully",
  });
};

// \resident_counsellor\admissions: PUT – use \admission_id to approve or decline by rc, entry into admission_approval table with comment(if declined) and also update the corresponding student details with the room and floor (The request body will contain the approval, rc_id, student user_id, room and floor) 
export const updateApprovalStatusByRCController = async (
  req: Request, 
  res: Response
): Promise<void> => {
  const { admission_id } = req.params;
  const validated = rcAdmissionDecisionSchema.parse(req.body);

  if (validated.approve === false && (!validated.comment || validated.comment.trim() === '')) {
      throw AppError(
        "Comment is required when declining an admission", httpStatus.BAD_REQUEST
      );
  }

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
    throw AppError("Admission not found for the provided ID", httpStatus.NOT_FOUND);
  }

  const rollNo = await getRollNumberByAdmissionId(Number(admission_id));
  const hostelBlock = admission[0].hostelBlock;
  const currentYear = await getAcademicYearByAdmissionId(Number(admission_id));

  if (validated.approve) {
    // Approval logic
    const status = approval_status.rc;
    
    if (!validated.room) {
      throw AppError("Room number is required for approval", httpStatus.BAD_REQUEST);
    }

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
      throw AppError(`Room is already full (${ROOM_SIZE} students)`, httpStatus.BAD_REQUEST);
    }

    // Create updated roll numbers array
    const updatedRollNos = room.rollNo ? [...room.rollNo, rollNo] : [rollNo];

    const setStudent = await setStudentinRoom(
      updatedRollNos,
      validated.room,
      hostelBlock,
      currentYear
    );

    if (!setStudent) {
      throw AppError("Failed to assign student to room", httpStatus.INTERNAL_SERVER_ERROR);
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

    // Update admission status
    const admissionUpdate = await updateAdmissionStatus({
      admission_id: Number(admission_id),
      status
    });

    if (!admissionUpdate) {
      throw AppError("Failed to update admission status", httpStatus.INTERNAL_SERVER_ERROR);
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



export const fetchAdmissionsApprovedByRC = async (
  req: Request,
  res: Response,
) => {
  const rcId = parseInt(req.params.rc_id);

  if (isNaN(rcId)) {
    throw AppError("Invalid RC ID", httpStatus.BAD_REQUEST);
  }
  const rc = await rcExists(rcId);
  if (!rc) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }
  const data = await getAdmissionsApprovedByRC(rcId);

  res.status(httpStatus.OK).json({
    success: true,
    data,
    message: "Admissions approved by RC fetched successfully",
  });
};