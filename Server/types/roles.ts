import { Request } from "express";

export interface CustomRequest extends Request {
  authUser?: {
    id: number;
    role: string;
  };
}

export type UserRole = "warden" | "rc" | "manager" | "student" | "admin" | "deputyWarden" | "executiveWarden";

export const PERMISSIONS = {
  warden: ["all"],
  rc: ["read_all", "approve_admission", "manage_students", "view_reports"],
  manager: ["read_all", "manage_rooms", "manage_mess", "view_reports"],
  student: ["read_own", "submit_application", "view_profile"],
} as const;

type allowedRetreivalUserRole =
  | "rc"
  | "manager"
  | "deputyWarden"
  | "executiveWarden";
export interface JWTPayload {
  id: string;
  role: allowedRetreivalUserRole;
}

export interface AuthenticatedRequest extends Request {
  userRole?: allowedRetreivalUserRole;
  userId?: string;
}

export const admissionRetreivalNumbers: Record<
  allowedRetreivalUserRole,
  string
> = {
  rc: "0",
  manager: "1",
  deputyWarden: "2",
  executiveWarden: "3",
};

export interface UserWithRole {
  id: number;
  role: UserRole;
}
