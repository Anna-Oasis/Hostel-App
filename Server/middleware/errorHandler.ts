import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppErrorType } from "../utils/AppError";
import { morganLogger } from "../utils/logger";

const isAppError = (error: any): error is AppErrorType => {
  return error && 
         error.name === 'AppError' && 
         typeof error.status === 'number' &&
         typeof error.message === 'string';
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.errors,
    });
    return;
  }
  if (isAppError(err)) {
    res.status(err.status).json({
      success: false,
      message: err.message,
    });
    return;
  }
  // for other errors
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message
  });
};

export default errorHandler;