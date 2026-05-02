import AppError from '../utils/AppError';
import { AuthRequest } from '../types/roles';
import httpStatus from "http-status";
import { logger } from '../utils/logger';
import { roomStructureAllocationService } from '../services/roomStructureAllocationService';

import { buildRoomStructure } from '../utils/roomStructure';

function isValidAcademicYear(year: string): boolean {
  const regex = /^\d{4}-\d{4}$/;
  return regex.test(year);
}

export const insertRoomStructureByDeputyWarden = async (
  req: AuthRequest,
  res: Response
):Promise<Void> => {
  const { academicYear } = req.body;

  if (typeof academicYear !== "string" || !academicYear.trim()) 
  {
    throw AppError("Inconsistent Data Passed",httpStatus.BAD_REQUEST);
  }

  if (!isValidAcademicYear(academicYear)) {
    throw AppError("Invalid academic year format", httpStatus.BAD_REQUEST);
  }

  const roomsToInsert = buildRoomStructure(academicYear);

  logger.info(`Room structure creation started for: ${academicYear},
    with total rooms: ${roomsToInsert.length}`
  );

  const result = await roomStructureAllocationService(roomsToInsert);

  logger.info(`Room structure created successfully for: ${
    academicYear},
    with total rooms: ${result.count}`);

  res.status(httpStatus.OK).json({
    success: true,
    message: `Room structure created for ${academicYear}`,
    data: result,
  });
};
