export type UserRole = 'admin' | 'rc' | 'manager' | 'student';

export const PERMISSIONS = {
  admin: ['all'],
  rc: ['read_all', 'approve_admission', 'manage_students', 'view_reports'],
  manager: ['read_all', 'manage_rooms', 'manage_mess', 'view_reports'],
  student: ['read_own', 'submit_application', 'view_profile']
} as const;