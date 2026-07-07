import { AuthRequest } from "../types/roles";
import { Response } from "express";
import AppError from "../utils/AppError";
import httpStatus from "http-status";
import { handleFileUpload } from "../services/cloudflare/fileUpload";
import { deputyWardenCreateSchema, deputyWardenUpdateSchema } from "../validation/dwSchema";
import { createDeputyWardenService, updateDeputyWardenService } from "../services/dwServices";

export const postDWDetailsController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  
  if (!req.User?.id) {
    throw AppError("User information is missing", httpStatus.UNAUTHORIZED);
  }
  const userId = req.User.id;
  console.log(userId)

  let passportPhotoFile: Express.Multer.File | undefined;

  if (
    req.files &&
    !Array.isArray(req.files) &&
    typeof req.files === "object"
  ) {
    passportPhotoFile = (req.files as { [fieldname: string]: Express.Multer.File[] })["passportPhoto"]?.[0];
  }

  const passportPhotoUrl = passportPhotoFile
    ? await handleFileUpload(passportPhotoFile, String(userId), "dw", "passport")
    : undefined;


  const rawPayload = {
    ...req.body,
    passportPhotoUrl,
  };
  console.log(rawPayload)

  const validated = deputyWardenCreateSchema.safeParse(rawPayload);
  if (!validated.success) {
    throw AppError(validated.error.errors[0].message, httpStatus.BAD_REQUEST);
  }

  const data = validated.data;

  const inserted = await createDeputyWardenService({
    userId : parseInt(userId),
    name : data.name,
    block : data.block,
    dept: data.dept,
    email : data.email,
    passportPhotoUrl : data.passportPhotoUrl
  })

  res.status(httpStatus.CREATED).json({
    success: true,
    message: "Deputy Warden Details created successfully",
    count: inserted.length,
    data: inserted,
  });
};


export const putDWDetailsController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.User?.id) {
    throw AppError("User information is missing", httpStatus.UNAUTHORIZED);
  }

  const userId = Number(req.User.id);

  let passportPhotoFile: Express.Multer.File | undefined;

  if (
    req.files &&
    !Array.isArray(req.files) &&
    typeof req.files === "object"
  ) {
    passportPhotoFile = (
      req.files as { [fieldname: string]: Express.Multer.File[] }
    )["passportPhoto"]?.[0];
  }

  const passportPhotoUrl = passportPhotoFile
    ? await handleFileUpload(
        passportPhotoFile,
        String(userId),
        "dw",
        "passport"
      )
    : undefined;

  const rawPayload = {
    ...req.body,
    passportPhotoUrl,
  };

  const parsed = deputyWardenUpdateSchema.safeParse(rawPayload);

  if (!parsed.success) {
    throw AppError(parsed.error.errors[0].message, httpStatus.BAD_REQUEST);
  }

  const updatePayload = {
    userId : userId,
    ...parsed.data,
  };
  console.log(updatePayload)

  const result = await updateDeputyWardenService(updatePayload);

  if (!result || result.length === 0) {
    throw AppError(
      "Failed to update Deputy Warden details",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  res.status(httpStatus.OK).json({
    success: true,
    message: "Deputy Warden details updated successfully",
    count: result.length,
    data: result,
  });
};