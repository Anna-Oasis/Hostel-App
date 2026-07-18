import api from "@/api";
import { getToken } from "@/utils/authUtils";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "NOT_MARKED" | "CONFLICT";

export type ManagerAttendanceReportRequest = {
  fromDate: string;
  toDate: string;
  admissionSessionId: number;
  hostelBlock: string;
};

export type ManagerAttendanceReportStudent = {
  rollNo: string;
  name: string;
  roomNumber: number | null;
  floor: number | null;
  hostelBlock: string | null;
  attendance: Record<string, AttendanceStatus>;
};

export type ManagerAttendanceReportWarning = {
  code: string;
  date?: string;
  hostel?: string;
  floor?: number;
  rollNo?: string;
  recordIds?: number[];
  admissionIds?: number[];
  reason?: string;
  rollNumbers?: string[];
};

export type ManagerAttendanceReportResponse = {
  success: boolean;
  filters: {
    fromDate: string;
    toDate: string;
    admissionSessionId: number;
    academicYear: string;
    hostelBlock: string;
  };
  dates: string[];
  students: ManagerAttendanceReportStudent[];
  summary: {
    studentCount: number;
    dateCount: number;
  };
  warnings: ManagerAttendanceReportWarning[];
  message: string;
};

export async function getManagerAttendanceReport(
  reportFilters: ManagerAttendanceReportRequest
) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await api.post<ManagerAttendanceReportResponse>(
      "/api/manager/attendance/report",
      reportFilters,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    const apiError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    window.alert(
      [
        "Fetch Error",
        apiError.response?.data?.message ||
          apiError.message ||
          "An error occurred while generating attendance report",
      ]
        .filter(Boolean)
        .join("\n")
    );
    throw error;
  }
}

