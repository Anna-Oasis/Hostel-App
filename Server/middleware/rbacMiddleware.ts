import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole, PERMISSIONS } from "../types/roles";
import { db } from "../config/dbConnection";
import { userModel } from "../models/userModel";
import { eq } from "drizzle-orm";

interface JwtPayload {
  id: string;
  role: UserRole;
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
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

    req.user = {
      id: user.id.toString(),
      role: user.role as UserRole
    };
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const hasRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ 
        success: false, 
        message: "You don't have permission to access this resource" 
      });
    }
  };
};

export const hasPermission = (requiredPermission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const userPermissions: string[] = Array.from(
      PERMISSIONS[req.user.role as keyof typeof PERMISSIONS]
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