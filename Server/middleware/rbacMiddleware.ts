import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole, PERMISSIONS } from "../types/roles";
import { db } from "../config/dbConnection";
import { userModel } from "../models/userModel";
import { eq } from "drizzle-orm";
import { AuthRequest } from "../types/roles";
import { JwtPayload } from "../types/roles";

/**
 * Middleware to authenticate users based on JWT token
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 * @returns 
 */
export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("Token received:", token);
    
    if (!token) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ success: false, message: "Server configuration error" });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    console.log("Decoded JWT:", decoded);

    // Query user from database using Drizzle
    const userResult = await db
      .select({
        id: userModel.id,
        role: userModel.role
      })
      .from(userModel)
      .where(eq(userModel.id, parseInt(decoded.id)))
      .limit(1);

    if (userResult.length === 0) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    const user = userResult[0];

    req.User = {
      id: user.id.toString(),
      role: user.role as UserRole
    };
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

/**
 * Middleware to check if the user has a specific role
 * @param allowedRoles - Array of roles that are allowed to access the resource
 * @returns Middleware function
 */
export const hasRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.User) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    if (allowedRoles.includes(req.User.role)) {
      next();
    } else {
      res.status(403).json({ 
        success: false, 
        message: "You don't have permission to access this resource" 
      });
    }
  };
};

/**
 * Middleware to check if the user has a specific permission
 * @param requiredPermission - The permission that is required to access the resource
 * @returns Middleware function
 */
export const hasPermission = (requiredPermission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.User) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }
    const userPermissions: string[] = Array.from(
      PERMISSIONS[req.User.role as keyof typeof PERMISSIONS]
    );
    
    if (
      userPermissions.includes('all') || 
      userPermissions.includes(requiredPermission)
    ) {
      next();
    } else {
      res.status(403).json({ 
        success: false, 
        message: "You don't have the required permission" 
      });
    }
  };
};