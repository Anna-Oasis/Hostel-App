export const GRIEVANCE_STATUS = {
  SUBMITTED: "0",
  RC: "1",
  MANAGER: "2",
  DECLINED: "-1",
} as const;

export type GrievanceStatus = (typeof GRIEVANCE_STATUS)[keyof typeof GRIEVANCE_STATUS];
