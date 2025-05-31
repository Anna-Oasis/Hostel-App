import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}

interface JwtPayload {
  id: string;
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      req.user = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  } else {
    res.status(401).json({
        success: false,
        message: "Not authorized, no token",
    });
  }
};