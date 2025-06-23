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
    const result = await updateRCLeaveStatus(Number(leave_id), rcLeaveApprovalStatus.EXECUTIVEWARDEN)
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
        data : result
      })
      break;
    case "executiveWarden" :
      const ewResult = await getRCLeaveToBeApprovedByExecutiveWarden()
      res.status(httpStatus.OK).json({
        success : true,
        data : ewResult
      })
      break;

  }
}


export const createRCLeaveFormFromController = async (req: AuthRequest, res: Response) => {
  const data = req.body;

  console.log("Data received for RC Leave Form:", data);
  console.log("User ID from request:", req.User);

  if (!data || data.length === 0) {
    throw AppError("Undefined Data Passed here", httpStatus.BAD_REQUEST);
  }
  if (!req.User || !req.User.id || !req.User.role) {
    throw AppError("Unauthorized user", httpStatus.UNAUTHORIZED);
  }

  const result = await createRcLeaveForm(data);
  const _rc = await getRCidfromUserId(Number(data.alternate))
  console.log("test",_rc)
  const rc = await getRCById(_rc)
  console.log("alternate RC ",rc)
  const updatedRC = await updateAlternateRCtoId(Number(data.rc_id), Number(data.alternate))

  res.status(httpStatus.OK)
    .json({
      success: true,
      message: "New Leave Form Created",
      data: result,
      updatedRc : updatedRC
    });
}

export const getRCLeaveController = async (req: AuthRequest, res: Response) => {
  if (!req.User || !req.User.id || !req.User.role) {
    throw AppError("Unauthorized user", httpStatus.UNAUTHORIZED);
  }

  const leaveForms = await getRCLeaveApprovals(Number(req.User.id));
  if (!leaveForms || leaveForms.length === 0) {
    throw AppError("No leave forms found for this RC", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: leaveForms,
    message: "Fetched RC Leave forms successfully",
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
    data : rcs,
    message : "Feched Successfully"
  })
}

export const updateCompleteLeave = async (req : AuthRequest, res : Response) => {
  if (!req.User || !req.User.id) {
    throw AppError("User is not valid", httpStatus.FORBIDDEN)
  }
  const updatedRC = await updateAlternateRCtoNull(Number(req.User.id))
  res.status(httpStatus.OK).json({
    success : true,
    data : updatedRC,
    message : "Updated the Leave Status"
  })
}