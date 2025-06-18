import { Request, Response } from "express";
import { 
  getGrievances, 
  updateGrievanceApprovalStatus 
} from "../services/rcServices";
import {  
  rcGrievanceDecisionSchema 
} from "../validation/rc.schema";
import httpStatus from "http-status";
import AppError from "../utils/AppError";
import { getRCById } from "../services/rcServices";



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



// export const fetchAdmissionsApprovedByRC = async (
//   req: Request,
//   res: Response,
// ) => {
//   const rcId = parseInt(req.params.rc_id);

//   if (isNaN(rcId)) {
//     throw AppError("Invalid RC ID", httpStatus.BAD_REQUEST);
//   }
//   const rc = await rcExists(rcId);
//   if (!rc) {
//     throw AppError("RC not found", httpStatus.NOT_FOUND);
//   }
//   const data = await getAdmissionsApprovedByRC(rcId);

//   res.status(httpStatus.OK).json({
//     success: true,
//     data,
//     message: "Admissions approved by RC fetched successfully",
//   });
// };

