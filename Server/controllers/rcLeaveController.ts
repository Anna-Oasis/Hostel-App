import { rcLeaveApprovalStatus } from "../constants/enum";
import { updateRCLeaveStatus, getRCLeaveToBeApprovedByDeputyWarden, getRCLeaveToBeApprovedByExecutiveWarden, createRcLeaveForm, getRCLeaveApprovals, updateAlternateRCtoId, updateAlternateRCtoNull } from "../services/rcLeaveService";
import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { Response } from "express";
import { getRCidfromUserId, getRCsbyHostel } from "../services/helper";
import { getRCById } from "../services/rcServices";

export const updateLeaveStatusForRC = async (
  req : AuthRequest,
  res : Response
) => {
  const { leave_id } = req.params;
  if (!leave_id) {
    throw AppError("Invalid Leave Selected")
  }
  if (!req.User) {
    throw AppError("Invalid User");
  }
  const {status} = req.body;
  if (!status) {
    throw AppError("Invalid Status");
  }

  if (req.User.role == "deputyWarden") {
    var result;
    if (status == "true") {
      result = await updateRCLeaveStatus(Number(leave_id), rcLeaveApprovalStatus.DEPUTYWARDEN)
    } else if (status == "false") {
      result = await updateRCLeaveStatus(Number(leave_id), rcLeaveApprovalStatus.DECLINED)
    }
    res.status(httpStatus.OK).json({
      success : true,
      data : result,
      message : "Leave Approved"
    })
  } else if(req.User.role == "executiveWarden") {
    var result;
    if (status == "true") {
      result = await updateRCLeaveStatus(Number(leave_id), rcLeaveApprovalStatus.EXECUTIVEWARDEN)
    } else if (status == "false") {
      result = await updateRCLeaveStatus(Number(leave_id), rcLeaveApprovalStatus.DECLINED)
    }
    res.status(httpStatus.OK).json({
      success : true,
      data : result,
      message : "Leave Approved"
    })
  }
}

export const getRCLeaves = async (
  req : AuthRequest,
  res : Response
) => {
  if (!req.User) {
    throw AppError("Invalid User or User missing");
  }
  switch (req.User.role) {
    case "deputyWarden" :
      const result = await getRCLeaveToBeApprovedByDeputyWarden()
      res.status(httpStatus.OK).json({
        success : true,
        data : result || [],
        count:result ? result.length:0,
        message: result && result.length>0
        ? "RC leaves fetched successfully"
        : "No RC leaves waiting for Deputy Warden approval"
      })
      break;
      
    case "executiveWarden" :
      const e_result = await getRCLeaveToBeApprovedByExecutiveWarden()
      
      res.status(httpStatus.OK).json({
        success : true,
        data : e_result || [],
        count:e_result ? e_result.length:0,
        message: e_result && e_result.length>0
        ? "RC leaves fetched successfully"
        : "No RC leaves waiting for Deputy Warden approval"
      })
      break;
      
    default:
      throw AppError("Unauthorized user role", httpStatus.UNAUTHORIZED);
  }
}

export const createRCLeaveFormFromController = async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      throw AppError("Leave form data is missing", httpStatus.BAD_REQUEST);
    }

    if (!req.User || !req.User.id || !req.User.role) {
      throw AppError("Unauthorized user", httpStatus.UNAUTHORIZED);
    }

    const userId = Number(req.User.id);
    const rcId = await getRCidfromUserId(userId);

    if (!rcId) {
      throw AppError("RC ID not found for user", httpStatus.NOT_FOUND);
    }

    data.rc_id = rcId;

    const result = await createRcLeaveForm(data);

    // const alternateRCId = await getRCidfromUserId(Number(data.alternate));
    const rc = await getRCById(Number(data.alternate));

    const updatedRC = await updateAlternateRCtoId(Number(data.rc_id), Number(data.alternate));

    res.status(httpStatus.OK).json({
      success: true,
      message: "New Leave Form Created",
      data: result,
      updatedRc: updatedRC,
    });
  } catch (error) {
    console.error("Error in createRCLeaveFormFromController:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
};

export const getRCLeaveController = async (req: AuthRequest, res: Response) => {
  if (!req.User || !req.User.id || !req.User.role) {
    throw AppError("Unauthorized user", httpStatus.UNAUTHORIZED);
  }
  const rc_id = await getRCidfromUserId(Number(req.User.id));
  const leaveForms = await getRCLeaveApprovals(rc_id);

  res.status(httpStatus.OK).json({
    success: true,
    data: leaveForms || [],
    count:leaveForms?leaveForms.length:0,
    message: leaveForms && leaveForms.length >0
    ? "Fetched RC Leave forms successfully"
    :"No RC leaves are found",
  });

}

export const fetchRCbyHostelController = async (req: AuthRequest, res: Response) => {
  if (!req.User) {
    throw AppError("User is invalid");
  } 
  const _rc  = await getRCidfromUserId(Number(req.User.id))
  const rc  = await getRCById(_rc);
  
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const rcs = await getRCsbyHostel(rc[0].hostel);
 
  res.status(httpStatus.OK).json({
    success : true,
    data : rcs || [],
    count:rcs?rcs.length:0,
    message : rcs && rcs.length>0
    ?"Feched Successfully"
    :"No RC's are found"
  })

}

export const updateCompleteLeave = async (req : AuthRequest, res : Response) => {
  if (!req.User || !req.User.id) {
    throw AppError("User is not valid", httpStatus.FORBIDDEN)
  }
  const rc_id = await getRCidfromUserId(Number(req.User.id));
  const updatedRC = await updateAlternateRCtoNull(rc_id)
  res.status(httpStatus.OK).json({
    success : true,
    data : updatedRC,
    message : "Updated the Leave Status"
  })
}