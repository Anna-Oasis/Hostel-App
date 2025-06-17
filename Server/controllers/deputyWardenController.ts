import { Request, Response } from "express";
import { 
  getAdmissionsByDeputyWarden,getGreivances
} from "../services/deputyWardenServices";
import { checkRoom, getStudentsofRoom, setStudentinRoom, updateStudentRoomNumber} from "../services/roomServices";
import {
  createAdmissionApproval, 
  updateAdmissionStatus,
  getRollNumberByAdmissionId,
  getAdmissionByAdmissionId 
} from "../services/admissionServices"
import { deputyWardenDecisionSchema } from "../validation/deputy-warden.schema";
import { approval_status } from "../constants/enum";
import AppError from "../utils/AppError";
import httpStatus from "http-status";

export const viewAdmissionsByDeputyWardenController = async (
  req: Request, 
  res: Response
): Promise<void> => {
  const admissions = await getAdmissionsByDeputyWarden();
  
  if (!admissions || admissions.length === 0) {
    throw AppError("No admissions found for approval", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({ 
    success: true, 
    data: admissions,
    message: "Admissions fetched successfully",
  });
};

export const approveOrDeclineAdmissionByDeputyWardenController = async (
  req: Request, 
  res: Response
): Promise<void> => {
  const { admission_id } = req.params;
  const validated = deputyWardenDecisionSchema.parse(req.body);
  
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
    throw AppError("Admission not found", httpStatus.NOT_FOUND);
  }

  const rollNo = await getRollNumberByAdmissionId(Number(admission_id));
  const hostelBlock = admission[0].hostelBlock;
  const currentYear = new Date().getFullYear().toString();

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
        throw new Error("Student is not assigned to this room");
      }

      // Remove student from room
      const updatedRollNos = room.rollNo.filter(r => r !== rollNo);
      
      await setStudentinRoom(
        updatedRollNos,
        validated.room, // Now we know this is defined
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

export const getGrievancesFromDeputyWardenController = async (req:Request,res:Response)=>
{

    const data = await getGreivances();

    if(data.length === 0)
    {
      throw AppError("Error Fetching Greivances From Deputy Warden Side",httpStatus.INTERNAL_SERVER_ERROR);
    }

    res.status(httpStatus.OK)
    .json(
      {
        success:true,
        message:"Greivances all are fetched from Deputy Warden Side",
        data:data
      }
    );
}