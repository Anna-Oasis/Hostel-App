import { Request, Response } from "express";
import { createGrievance, getGrievancesByRollNumber } from "../services/grievanceService";

export const createGrievanceController = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await createGrievance(data);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create grievance" });
  }
};

export const getGrievancesByRollNumberController = async (req: Request, res: Response) => {
  const rollNumber = req.params.roll_number;
  try {
    const result = await getGrievancesByRollNumber(rollNumber);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch grievances" });
  }
};
