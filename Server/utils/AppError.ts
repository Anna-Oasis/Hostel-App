import httpStatus from "http-status";

export interface AppErrorType extends Error {
  message: string;
  status: number;
}

export const AppError = (
  message: string,
  status: number = httpStatus.BAD_REQUEST
): AppErrorType => {
    
  const error = new Error(message) as AppErrorType;
  error.name = "AppError";
  error.message = message;
  error.status = status;

  return error;
};

export default AppError;
