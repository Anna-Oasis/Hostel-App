import { NextFunction, Response } from "express";
import { constants } from "../constants/error";
import jwt from "jsonwebtoken";
import errorHandler from "./errorHandler";
import { AuthenticatedRequest, JWTPayload } from "../types/roles";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      JWT_SECRET: string;
    }
  }
}

export function validateJWT(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.statusCode = 401;
    return next(
      errorHandler(
        { message: "You are not authenticated. Please Login" },
        req,
        res,
        next
      )
    );
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      res.statusCode = constants.FORBIDDEN;
      err.message = "Forbidden. Token is not valid";
      return next(errorHandler(err, req, res, next));
    }

    req.userRole = (user as JWTPayload).role;
    req.userId = (user as JWTPayload).id;
    next();
  });
}
