import { Response } from "express";
import { createAdmissionSessionSchema } from "../validation/admissionSession.schema";
import { createAdmissionSessionService, getAdmissionSessionsService, updateAdmissionSessionService, getLatestAdmissionSessionForSemesterService } from "../services/admissionSessionServices";
import { AuthRequest } from "../types/roles";
import AppError from "../utils/AppError";
import httpStatus from "http-status";

import { insertRoomStructure } from "../roomStructure";

export async function createAdmissionSessionController(req: AuthRequest, res: Response) {
  const parseResult = createAdmissionSessionSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw AppError(
      "Validation failed",
      httpStatus.BAD_REQUEST
    );
  }
  try {
    const session = await createAdmissionSessionService(parseResult.data);
    res.status(httpStatus.OK).json({
      success: true,
      data: session,
      message: "Admission session created successfully",
    });
  } catch (err) {
    throw AppError(
      "Failed to create admission session",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }

  try
  {
    const academic_year=parseResult.data.academic_year;

    if(!academic_year || typeof academic_year != 'string')
    { 
      res.status(httpStatus.BAD_REQUEST).json(
        {
          message:"Inconsistent Year Passed"
        }
      )
    }

    const result=await insertRoomStructure(academic_year);

    if(result?.status === httpStatus.BAD_REQUEST)
    {
      res.status(result?.status).json(
        {
          message:result.message
        }
      )
    }

    res.status(httpStatus.OK).json(
      {
        message:`Rooms for the academic Year ${result?.academicYear} with no of Rooms: ${result?.count}`,
        success:true,
        data:result?.count
      }
    )
  }catch(error)
  {
    throw AppError("Failed to allocate Rooms:",httpStatus.INTERNAL_SERVER_ERROR)
  }
}

export async function getAdmissionSessionsController(req: AuthRequest, res: Response) {
  try {
    const sessions = await getAdmissionSessionsService();
    res.status(httpStatus.OK).json({
      success: true,
      data: sessions,
      count: sessions ? sessions.length : 0,
      message: sessions && sessions.length > 0
        ? "Fetched admission sessions successfully"
        : "No admission sessions found",
    });
  } catch (err) {
    throw AppError(
      "Failed to fetch admission sessions",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export async function updateAdmissionSessionController(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const parseResult = createAdmissionSessionSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw AppError(
      "Validation failed",
      httpStatus.BAD_REQUEST
    );
  }
  try {
    const updated = await updateAdmissionSessionService(Number(id), parseResult.data);
    res.status(httpStatus.OK).json({
      success: true,
      data: updated,
      message: updated && updated.length > 0
        ? "Admission session updated successfully"
        : "No admission session found with the given id",
    });
  } catch (err) {
    throw AppError(
      "Failed to update admission session",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
}

export async function getLatestAdmissionSessionForSemesterController(req: AuthRequest, res: Response) {
  const semester = Number(req.params.semester);
  if (isNaN(semester)) {
    throw AppError("Invalid semester", httpStatus.BAD_REQUEST);
  }
  try {
    const session = await getLatestAdmissionSessionForSemesterService(semester);
    
    let isOpen = false;
    if (session) {
      const currentDate = new Date();
      // Parse as local date at midnight
      const fromDate = new Date(session.from + "T00:00:00");
      const toDate = new Date(session.to + "T23:59:59");
      
      isOpen = currentDate >= fromDate && currentDate <= toDate;
    }
    
    res.status(httpStatus.OK).json({
      success: true,
      data: session || null,
      isOpen,
      message: session
        ? "Fetched latest active admission session successfully"
        : "No active admission session found for the given semester",
    });
  } catch (err) {
    console.error("Error fetching latest admission session:", err);
    throw AppError(
      "Failed to fetch admission session",
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
