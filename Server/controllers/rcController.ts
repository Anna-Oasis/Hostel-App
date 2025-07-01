import { Response } from "express";
import { 
  createRC,
  getAllRCs,
  deleteRC,
  updateRC,
  getAllRCDetailsService,
} from "../services/rcServices";
import httpStatus from "http-status";
import AppError from "../utils/AppError";
import { getRCById } from "../services/rcServices";
import { AuthRequest } from "../types/roles";
import { rcCreateSchema, rcUpdateSchema } from "../validation/rc.schema";
import { createUser, deleteUser, getRCidfromUserId, getRCsbyHostel } from "../services/helper";
import { getRCDetailsByUserIdService, createRCDetailsService, updateRCDetailsService } from "../services/rcServices";
import { rcDetailsSchema } from "../validation/rcDetails.schema";
import { handleFileUpload } from "../services/cloudflare/fileUpload";

export async function createRCController(req: AuthRequest, res: Response): Promise<void> {
  const validated = rcCreateSchema.parse(req.body);

  const user = await createUser(
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


  res.status(httpStatus.OK).json({
    success: true,
    data: rcs || [],
    count:rcs?rcs.length:0,
    message:rcs && rcs.length>0 
    ?"Fetched all RCs successfully"
    : "No RCs found",
  });
}

export async function updateRCController(req: AuthRequest, res: Response): Promise<void> {
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

export async function getRCDetailsController(req: AuthRequest, res: Response): Promise<void> {
  if (!req.User?.id) {
    throw AppError("User ID missing", httpStatus.UNAUTHORIZED);
  }

  const userId = Number(req.User.id);
  const details = await getRCDetailsByUserIdService(userId);

  res.status(httpStatus.OK).json(
    !details
      ? {
          success: true,
          message: "RC Details not found",
          count: 0,
          data: [],
        }
      : {
          success: true,
          message: "RC Details fetched successfully",
          count: 1,
          data: [details],
        }
  );
}

export const postRCDetailsController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User?.id) {
    throw AppError("User information is missing", httpStatus.UNAUTHORIZED);
  }
  const userId = req.User.id;

  let passportPhotoFile: Express.Multer.File | undefined;
  let rcSignatureFile: Express.Multer.File | undefined;

  if (
    req.files &&
    !Array.isArray(req.files) &&
    typeof req.files === "object"
  ) {
    passportPhotoFile = (req.files as { [fieldname: string]: Express.Multer.File[] })["passportPhoto"]?.[0];
    rcSignatureFile = (req.files as { [fieldname: string]: Express.Multer.File[] })["rcSignature"]?.[0];
  }

  const passportPhotoUrl = passportPhotoFile
    ? await handleFileUpload(passportPhotoFile, String(userId), "rc", "passport")
    : undefined;

  const rcSignatureUrl = rcSignatureFile
    ? await handleFileUpload(rcSignatureFile, String(userId), "rc", "signature")
    : undefined;

  const rawPayload = {
    ...req.body,
    passportPhotoUrl,
    rcSignatureUrl,
    dob: req.body.dob
      ? new Date(req.body.dob)
      : undefined,
  };

  const validated = rcDetailsSchema.safeParse(rawPayload);
  if (!validated.success) {
    throw AppError(validated.error.errors[0].message, httpStatus.BAD_REQUEST);
  }

  const data = validated.data;

  const inserted = await createRCDetailsService({
    ...data,
    userId: Number(userId),
    dob: data.dob.toISOString().split("T")[0], 
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "RC Details created successfully",
    count: inserted.length,
    data: inserted,
  });
};




export const putRCDetailsController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User?.id) {
    throw AppError("User information is missing", httpStatus.UNAUTHORIZED);
  }

  const userId = Number(req.User.id);

  let passportPhotoFile: Express.Multer.File | undefined;
  let rcSignatureFile: Express.Multer.File | undefined;

  if (
    req.files &&
    !Array.isArray(req.files) &&
    typeof req.files === "object"
  ) {
    passportPhotoFile = (req.files as { [fieldname: string]: Express.Multer.File[] })["passportPhoto"]?.[0];
    rcSignatureFile = (req.files as { [fieldname: string]: Express.Multer.File[] })["rcSignature"]?.[0];
  }

  const passportPhotoUrl = passportPhotoFile
    ? await handleFileUpload(passportPhotoFile, String(userId), "rc", "passport")
    : undefined;

  const rcSignatureUrl = rcSignatureFile
    ? await handleFileUpload(rcSignatureFile, String(userId), "rc", "signature")
    : undefined;

  const rawPayload = {
    ...req.body,
    passportPhotoUrl,
    rcSignatureUrl,
    dob: req.body.dob ? new Date(req.body.dob) : undefined,
  };

  const parsed = rcDetailsSchema.safeParse(rawPayload);
  if (!parsed.success) {
    throw AppError(parsed.error.errors[0].message, httpStatus.BAD_REQUEST);
  }

  const validatedData = parsed.data;

  const updatePayload = {
    ...validatedData,
    userId, 
    dob: validatedData.dob.toISOString().split("T")[0],
  };

  const result = await updateRCDetailsService(updatePayload);

  if (!result || result.length === 0) {
    throw AppError("Failed to update RC Details", httpStatus.INTERNAL_SERVER_ERROR);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "RC Details updated successfully",
    count: result.length,
    data: result,
  });
};


export const getAllRCDetailsController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const rcList = await getAllRCDetailsService();

  if (!rcList || rcList.length === 0) {
    throw AppError("No RC Details found", httpStatus.NOT_FOUND);
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "All RC Details fetched successfully",
    count: rcList.length,
    data: rcList,
  });
};