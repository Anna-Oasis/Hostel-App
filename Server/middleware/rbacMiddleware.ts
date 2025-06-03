import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole, PERMISSIONS } from "../types/roles";
import { supabase } from "../config/supabaseBucket";

interface JwtPayload {
  id: string;
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    

    const { data: user, error } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", decoded.id)
      .single();

    if (error || !user) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }

    req.user = {
      id: user.id,
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

    const userPermissions: string[] = Array.from(PERMISSIONS[req.user.role]);
    
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