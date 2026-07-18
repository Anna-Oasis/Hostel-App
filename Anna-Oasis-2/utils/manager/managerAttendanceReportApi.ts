import api from "@/api";
import { getToken } from "@/utils/authUtils";
import * as XLSX from "xlsx";

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

//Export attendance 
export type StudentAttendanceSummary = {
  present: number;
  absent: number;
  notMarked: number;
  conflict: number;
  percentage: string;
};
export const getStudentSummary = (
  student: ManagerAttendanceReportStudent
): StudentAttendanceSummary => {
  const statuses = Object.values(student.attendance);
  const present = statuses.filter((status) => status === "PRESENT").length;
  const absent = statuses.filter((status) => status === "ABSENT").length;
  const notMarked = statuses.filter((status) => status === "NOT_MARKED").length;
  const conflict = statuses.filter((status) => status === "CONFLICT").length;
  const markedDays = present + absent;
  const percentage =
    markedDays === 0 ? "0.0%" : `${((present / markedDays) * 100).toFixed(1)}%`;

  return { present, absent, notMarked, conflict, percentage };
};

export const exportAttendance = (filteredStudents : ManagerAttendanceReportStudent[], report : ManagerAttendanceReportResponse) => {

  if(!report) return;

  const data = filteredStudents.map((student) => {
    const summary = getStudentSummary(student);

    const row: Record<string, any> = {
      "Roll No": student.rollNo,
      Name: student.name,
      Floor: student.floor,
      Room: student.roomNumber,
      Present: summary.present,
      Absent: summary.absent,
      "Not Marked": summary.notMarked,
      Conflict: summary.conflict,
      "Attendance %": summary.percentage,
    };

    report.dates.forEach((date) => {
      row[date] = student.attendance[date];
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  XLSX.writeFile(workbook, "Attendance_Report.xlsx");
};

