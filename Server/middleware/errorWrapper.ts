import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/roles";
const errorWrapper = (
  controller: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        console.log("Executing controller:", controller.name);
      await controller(req, res, next);
    } catch (error) {
      console.error("Error occurred in controller:", controller.name, error);
      return next(error);
    }
  };
};

export default errorWrapper;