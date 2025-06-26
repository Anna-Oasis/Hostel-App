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
  getRoomByRollNo,
} from "../services/admissionServices";
import { Response } from "express";
import { createAdmissionSchema } from "../validation/admission.schema";
import { admissionApprovalStatus } from "../constants/enum";
import AppError from "../utils/AppError";
import { managerAdmissionDecisionSchema } from "../validation/manager.schema";
import { AuthRequest } from "../types/roles";
import { getAdmissionsApprovedByUser } from "../services/admissionServices";
import {
  updateAdmissionStatus,
  getRollNumberByAdmissionId,
} from "../services/admissionServices";
import { rcAdmissionDecisionSchema } from "../validation/rc.schema";
import {
  checkRoom,
  setStudentinRoom,
  updateStudentHostelDetails,
} from "../services/roomServices";
import { ROOM_SIZE } from "../constants/values";
import { getRCById, getRCByUserId } from "../services/rcServices";
import { getRCidfromUserId } from "../services/helper";
import { wardenDecisionSchema } from "../validation/warden.schema";
import { count } from "console";

// GET – Fetch all admissions waiting for approval based on user role - manager, deputy warden, or executive warden
export async function fetchAdmissionWaitingForApprovalController(
  req: AuthRequest,
  res: Response
) {
  if (!req.User || !req.User.role) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }
  const userRole = req.User.role;
  let reqStatus: string;

  if (userRole === "manager") {
    reqStatus = admissionApprovalStatus.SUBMITTED;
  } else if (userRole === "deputyWarden") {
    reqStatus = admissionApprovalStatus.RC;
  } else if (userRole === "executiveWarden") {
    reqStatus = admissionApprovalStatus.DEPUTYWARDEN;
  } else {
    throw AppError("Unauthorized user role", httpStatus.UNAUTHORIZED);
  }

  const submittedAdmissions = await getAdmissionsByStatus(reqStatus);

  res.status(httpStatus.OK).json({
    success: true,
    user: req.User,
    data: submittedAdmissions|| [],
    count: submittedAdmissions?submittedAdmissions.length:0,
    message: submittedAdmissions && submittedAdmissions.length >0
    ? "Admissions retrieved successfully"
    : "No Admissions found",
  });
}

// \resident_counsellor\admissions: GET – \rc_id as path param, Fetch all admissions waiting for RC approval belonging to the hostel block of the rc
export const getAdmissionWaitingForApprovalByRCController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User || !req.User.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }

  const rc_id = await getRCidfromUserId(Number(req.User.id));
  if (!rc_id) {
    throw AppError("RC not found for the user", httpStatus.NOT_FOUND);
  }
  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const admissions = await getAdmissionsToBeApprovedByRcByHostelBlock(
    rc[0].hostel
  );

  res.status(httpStatus.OK).json({
    success: true,
    data: admissions || [],
    count:admissions?admissions.length:0,
    message: admissions&&admissions.length>0
    ?"Fetched Admissions successfully"
    : "No Admissions found"
  });
};

// used for updating the approval status of an admission by the manager , deputy warden or executive warden
export async function approveByManagerController(
  req: AuthRequest,
  res: Response
) {
  const { admission_id } = req.params;
  const { approve, comment } = req.body;

  if (!admission_id || isNaN(Number(admission_id))) {
    throw AppError("Invalid or missing admission ID", httpStatus.BAD_REQUEST);
  }

  if (!req.User || !req.User.id) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }
  const user_id = req.User.id;

  if (!admission_id || typeof approve !== "boolean") {
    throw AppError(
      "Admission ID and status (boolean) are required",
      httpStatus.BAD_REQUEST
    );
  }

  // If approve is false, comment is required
  if (approve === false && (!comment || comment.trim() === "")) {
    throw AppError(
      "Comment is required when declining an admission",
      httpStatus.BAD_REQUEST
    );
  }

  const existingAdmission = await getAdmissionByAdmissionId(
    Number(admission_id)
  );

  if (existingAdmission.length === 0) {
    throw AppError(
      "Admission not found for the provided ID",
      httpStatus.NOT_FOUND
    );
  }

  const updatedAdmission = await updateAdmission(Number(admission_id), {
    status: admissionApprovalStatus.MANAGER,
    updatedAt: new Date(),
  });

  const approvalEntry = await createAdmissionApproval({
    admission_id: Number(admission_id),
    user_id: Number(user_id),
    approve: approve,
    comment: comment || null,
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: {
      admission: updatedAdmission,
      approval: approvalEntry[0],
    },
    message: "Admission status updated successfully",
  });
}

// student/admissions: POST – Create the admission for the student
export async function createAdmissionController(
  req: AuthRequest,
  res: Response
) {
  const admissionData = req.body;
  const parsedData = createAdmissionSchema.parse(admissionData);

  const existingAdmissions = await checkForAdmissionByRollNumberAndAcademicYear(
    parsedData.roll_number,
    parsedData.academicYear
  );
  if (existingAdmissions.length > 0) {
    //checks whether an admission already exists for the provided roll number and academic year
    throw AppError(
      "Admission already exists for the provided roll number and academic year",
      httpStatus.BAD_REQUEST
    );
  }

  const newAdmission = await createAdmission({
    ...parsedData,
    status: admissionApprovalStatus.SUBMITTED,
    submission_Date: new Date(),
    updatedAt: new Date(),
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    data: newAdmission,
    message: "Admission created successfully",
  });
}

// student/admissions: GET – \roll_number as path param and fetch the admission details and status of a particular student
export async function getAdmissionByRollNumberController(
  req: AuthRequest,
  res: Response
) {
  const { roll_number } = req.params;
  if (!roll_number) {
    throw AppError("Roll number is required", httpStatus.BAD_REQUEST);
  }

  const admission = await getAdmissionByRollNumber(roll_number);

  res.status(200).json({
    success: true,
    data: admission|| [],
    count:admission? admission.length:0,
    message: admission&&admission.length>0
    ?"Admission retrieved successfully"
    :"No admission found for the provided roll number",
  });
}

export async function getAdmissionByAdmissionIdController(
  req: AuthRequest,
  res: Response
) {
  const { admissionId } = req.params;
  const admission = await getAdmissionByAdmissionId(Number(admissionId));
 
  res.status(200).json({
    success: true,
    data: admission||[],
    count:admission?admission.length:0,
    message:admission && admission.length>0 
    ? "Admission retrieved successfully"
    :  "No admission found for the provided admission ID",
  });
}

export async function updateAdmissionController(
  req: AuthRequest,
  res: Response
) {
  const { admissionId } = req.params;
  const updatedData = req.body;

  if (isNaN(Number(admissionId))) {
    throw AppError(
      "Invalid admission ID. It is not a number",
      httpStatus.BAD_REQUEST
    );
  }

  const parsedData = createAdmissionSchema.parse(updatedData);
  const existingAdmission = await getAdmissionByAdmissionId(
    Number(admissionId)
  );
  if (existingAdmission.length === 0) {
    throw AppError(
      "Admission not found for the provided admission ID",
      httpStatus.BAD_REQUEST
    );
  }
  if (
    existingAdmission[0].status !== admissionApprovalStatus.SUBMITTED &&
    existingAdmission[0].status !== admissionApprovalStatus.DECLINED
  ) {
    throw AppError(
      "Admission can only be updated if it is in submitted or declined status",
      httpStatus.BAD_REQUEST
    );
  }

  const { roll_number, ...restData } = parsedData as any; // removing the roll_number updated data
  const updatedAdmission = await updateAdmission(Number(admissionId), {
    ...restData,
    updatedAt: new Date(),
    status: admissionApprovalStatus.SUBMITTED,
  });
  res.status(200).json({
    success: true,
    data: updatedAdmission,
    message: "Admission updated successfully",
  });
}

// \manager\admissions: PUT – use \admission_id to approve or decline by manager, entry into admission_approval table with comment(if declined)
export async function updateApprovalStatusByManagerController(
  req: AuthRequest,
  res: Response
) {
  const { admission_id } = req.params;
  const user = req.User;
  const parsedData = managerAdmissionDecisionSchema.parse(req.body);

  // If status is false, comment is required
  if (
    parsedData.approve === false &&
    (!parsedData.comment || parsedData.comment.trim() === "")
  ) {
    throw AppError(
      "Comment is required when declining an admission",
      httpStatus.BAD_REQUEST
    );
  }

  const existingAdmission = await getAdmissionByAdmissionId(
    Number(admission_id)
  );
  if (existingAdmission.length === 0) {
    throw AppError(
      "Admission not found for the provided ID",
      httpStatus.NOT_FOUND
    );
  }

  const newStatus = parsedData.approve
    ? admissionApprovalStatus.MANAGER
    : admissionApprovalStatus.DECLINED;

  const updatedAdmission = await updateAdmission(Number(admission_id), {
    status: newStatus,
    updatedAt: new Date("Asia/Kolkata"),
  });

  const approvalEntry = await createAdmissionApproval({
    admission_id: Number(admission_id),
    user_id: parsedData.user_id,
    approve: parsedData.approve,
    comment: parsedData.comment || null,
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: {
      admission: updatedAdmission,
      approval: approvalEntry[0],
    },
    message: parsedData.approve
      ? "Admission approved and forwarded to RC"
      : "Admission declined successfully",
  });
}

export const fetchAdmissionsApprovedByUser = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.User || !req.User.id) {
    throw AppError("User ID is required", httpStatus.UNAUTHORIZED);
  }
  const userID = parseInt(req.User.id);
  console.log("User ID:", userID);

  if (isNaN(userID)) {
    throw AppError("Invalid User ID", httpStatus.BAD_REQUEST);
  }
  const admission = await getAdmissionsApprovedByUser(userID);
  console.log("Fetched Admissions:", admission);

   res.status(200).json({
    success: true,
    data: admission||[],
    count:admission?admission.length:0,
    message:admission && admission.length>0 
    ? "Admissions approved fetched successfully"
    :  "No admission found ",
  });
};

// \resident_counsellor\admissions: PUT – use \admission_id to approve or decline by rc, entry into admission_approval table with comment(if declined) and also update the corresponding student details with the room and floor (The request body will contain the approval, rc_id, student user_id, room and floor)
export const updateApprovalStatusByRCController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { admission_id } = req.params;
  if (!admission_id || isNaN(Number(admission_id))) {
    throw AppError("Invalid or missing admission ID", httpStatus.BAD_REQUEST);
  }
  if (!req.User || !req.User.id) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }

  const rc = await getRCByUserId(Number(req.User.id));
  const rc_userId = req.User.id;
  if (!rc || rc.length === 0) {
    throw AppError("RC not found ", httpStatus.NOT_FOUND);
  }

  const validated = rcAdmissionDecisionSchema.parse(req.body);
  console.log("Validated Data:", validated);
  if (
    validated.approve === false &&
    (!validated.comment || validated.comment.trim() === "")
  ) {
    throw AppError(
      "Comment is required when declining an admission",
      httpStatus.BAD_REQUEST
    );
  }

  const approvalResult = await createAdmissionApproval({
    admission_id: Number(admission_id),
    user_id: Number(rc_userId),
    approve: validated.approve,
    comment: validated.comment,
  });

  if (!approvalResult) {
    throw AppError(
      "Failed to create admission approval",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  const admission = await getAdmissionByAdmissionId(Number(admission_id));
  if (!admission || admission.length === 0) {
    throw AppError(
      "Admission not found for the provided ID",
      httpStatus.NOT_FOUND
    );
  }

  const rollNo = await getRollNumberByAdmissionId(Number(admission_id));
  const currentYear = admission[0].academicYear;
  if (validated.approve) {
    const status = admissionApprovalStatus.RC;

    // Check room capacity before approval
    const room = await checkRoom(validated.room, validated.hostel_block, currentYear);
    if (!room) {
      throw AppError("Room Not Found!", httpStatus.NOT_FOUND);
    }
    if (room.rollNo?.includes(rollNo)) {
      throw AppError(
        "Student is already assigned to this room",
        httpStatus.BAD_REQUEST
      );
    }
    if (room.rollNo && room.rollNo.length >= ROOM_SIZE) {
      throw AppError(
        `Room is already full (${ROOM_SIZE} students)`,
        httpStatus.BAD_REQUEST
      );
    }

    // Create updated roll numbers array
    const updatedRollNos = room.rollNo ? [...room.rollNo, rollNo] : [rollNo];

    const setStudent = await setStudentinRoom(
      updatedRollNos,
      validated.room,
      validated.hostel_block,
      currentYear
    );

    if (!setStudent) {
      throw AppError(
        "Failed to assign student to room",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Update admission status
    const admissionUpdate = await updateAdmissionStatus({
      admission_id: Number(admission_id),
      status,
    });

    if (!admissionUpdate) {
      throw AppError(
        "Failed to update admission status",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Update student hostel details
    const studentUpdate = await updateStudentHostelDetails(rollNo, validated.room, validated.floor, validated.hostel_block);

    if (!studentUpdate) {
      throw AppError(
        "Failed to update student room and floor",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  } else {
    // Denial logic
    const status = admissionApprovalStatus.DECLINED;

    // Update admission status
    const admissionUpdate = await updateAdmissionStatus({
      admission_id: Number(admission_id),
      status,
    });

    if (!admissionUpdate) {
      throw AppError(
        "Failed to update admission status",
        httpStatus.INTERNAL_SERVER_ERROR
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

// PUT – use \admission_id to approve or decline by deputy warden and Executive warden, entry into admission_approval table with comment(if declined) and also update the corresponding student details with the room and floor (The request body will contain the approval, student_user_id, room and comment)
export const updateApprovalStatusByWardenController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { admission_id } = req.params;

  if (!admission_id || isNaN(Number(admission_id))) {
    throw AppError("Invalid or missing admission ID", httpStatus.BAD_REQUEST);
  }

  if (!req.User || !req.User.role || !req.User.id) {
    throw AppError(
      "User information is missing from request",
      httpStatus.UNAUTHORIZED
    );
  }
  const role = req.User.role;
  const user_id = req.User.id;
  const validated = wardenDecisionSchema.parse(req.body);

  // If status is false, comment is required
  if (
    validated.approve === false &&
    (!validated.comment || validated.comment.trim() === "")
  ) {
    throw AppError(
      "Comment is required when declining an admission",
      httpStatus.BAD_REQUEST
    );
  }

  // Common approval creation
  const approvalResult = await createAdmissionApproval({
    admission_id: Number(admission_id),
    user_id: Number(user_id),
    approve: validated.approve,
    comment: validated.comment,
  });

  if (!approvalResult) {
    throw AppError(
      "Failed to create admission approval",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  const admission = await getAdmissionByAdmissionId(Number(admission_id));
  if (!admission || admission.length === 0) {
    throw AppError(
      "Admission not found for the provided ID",
      httpStatus.NOT_FOUND
    );
  }

  const rollNo = await getRollNumberByAdmissionId(Number(admission_id));
  const hostelBlock = admission[0].hostelBlock;
  const currentYear = admission[0].academicYear;

  if (validated.approve) {
    // Approval logic
    let status : string;
    if (role === "deputyWarden") {
      if (admission[0].status !== admissionApprovalStatus.RC) {
        throw AppError("Admission must be approved by RC before Deputy Warden approval",httpStatus.BAD_REQUEST
        );
      }
      status = admissionApprovalStatus.DEPUTYWARDEN;
    }else if (role === "executiveWarden") {
      if (admission[0].status !== admissionApprovalStatus.DEPUTYWARDEN) {
        throw AppError("Admission must be approved by Deputy Warden before Executive Warden approval", httpStatus.BAD_REQUEST);
      }
      status = admissionApprovalStatus.EXECUTIVEWARDEN;
    }
    else {
      throw AppError("Unauthorized user role", httpStatus.UNAUTHORIZED);
    }
    // Update admission status
    const admissionUpdate = await updateAdmissionStatus({
      admission_id: Number(admission_id),
      status,
    });

    if (!admissionUpdate) {
      throw AppError(
        "Failed to update admission status",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
  } else {
    // Denial logic
    const status = admissionApprovalStatus.DECLINED;

    // Update admission status
    const admissionUpdate = await updateAdmissionStatus({
      admission_id: Number(admission_id),
      status,
    });

    if (!admissionUpdate) {
      throw AppError(
        "Failed to update admission status",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // Clear student hostel details
    const studentUpdate = await updateStudentHostelDetails(rollNo, null, null, '');

    if (!studentUpdate) {
      throw AppError(
        "Failed to clear student room assignment",
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const roomNo=await getRoomByRollNo(rollNo);

    // Only proceed with room removal
    if (roomNo) {
      const room = await checkRoom(roomNo, hostelBlock, currentYear);

      if (!room) {
        throw AppError("Room Not Found!", httpStatus.NOT_FOUND);
      }

      // Check if student is in this room
      if (!room.rollNo || !room.rollNo.includes(rollNo)) {
        throw new Error("Student is not assigned to this room.");
      }

      // Remove student from room
      const updatedRollNos = room.rollNo.filter((r) => r !== rollNo);

      await setStudentinRoom(
        updatedRollNos,
        roomNo,
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
