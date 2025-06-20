import { Request, Response } from "express";
import { 
  getGrievances, 
  updateGrievanceApprovalStatus ,
  createRC,
  getAllRCs,
  deleteRC,
  updateRC,
} from "../services/rcServices";
import {  
  rcGrievanceDecisionSchema 
} from "../validation/rc.schema";
import httpStatus from "http-status";
import AppError from "../utils/AppError";
import { getRCById } from "../services/rcServices";
import { AuthRequest } from "../types/roles";
import { rcCreateSchema, rcUpdateSchema } from "../validation/rc.schema";
import { createUser ,deleteUser } from "../services/helper";

export async function createRCController(req:AuthRequest,res:Response): Promise<void> {
  const validated = rcCreateSchema.parse(req.body);

  const  user = await createUser(
    validated.email,
    validated.name,
    validated.password,
    "rc");
  if (!user || user.length === 0) {
    throw AppError("Failed to create user account for RC", httpStatus.INTERNAL_SERVER_ERROR);
  }

  const rc = await createRC(
    validated.name,
     user[0].id,
    validated.hostel
  );
  if (!rc || rc.length === 0) {
    await deleteUser(user[0].id);
    throw AppError("Failed to create RC", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.CREATED).json({
    success: true,
    data: rc[0],
    message: "RC created successfully",
  });
}

export async function getRCsController(req: AuthRequest, res: Response): Promise<void> {
  const rcs = await getAllRCs();
  if (!rcs || rcs.length === 0) {
    throw AppError("No RCs found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: rcs,
    message: "Fetched all RCs successfully",
  });
}

export async function updateRCController (req: AuthRequest, res: Response): Promise<void> {
  const { rc_id } = req.params;
  if (!rc_id || isNaN(Number(rc_id))) {
    throw AppError("RC id is not in search param or id is NaN", httpStatus.BAD_REQUEST);
  }

  const validated = rcUpdateSchema.parse(req.body);
  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const updatedRC = await updateRC(
    Number(rc_id),
    validated.name ? validated.name : rc[0].name,
    validated.hostel ? validated.hostel : rc[0].hostel,
    validated.floor ? validated.floor : []
  );

  if (!updatedRC || updatedRC.length === 0) {
    throw AppError("Failed to update RC", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: updatedRC[0],
    message: "RC updated successfully",
  });
}

export async function deleteRCController(req: AuthRequest, res: Response): Promise<void> {
  const { rc_id } = req.params;

  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const deletedRC = await deleteRC(Number(rc_id));
  if (!deletedRC || deletedRC.length === 0) {
    throw AppError("Failed to delete RC", httpStatus.INTERNAL_SERVER_ERROR);
  }

  const userDeletionResult = await deleteUser(rc[0].userId);
  if (!userDeletionResult || userDeletionResult.length === 0) {
    throw AppError("Failed to delete user associated with RC", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "RC deleted successfully",
  });
}

export const viewGrievancesByRCController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { rc_id } = req.params;

  const rc = await getRCById(Number(rc_id));
  if (!rc || rc.length === 0) {
    throw AppError("RC not found", httpStatus.NOT_FOUND);
  }

  const grievances = await getGrievances(rc[0].hostel, rc[0].floor ?? []);
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

