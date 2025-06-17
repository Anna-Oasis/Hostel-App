import { Request, Response, NextFunction } from "express";
// Adjust the import path as necessary

const errorWrapper = (
  controller: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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