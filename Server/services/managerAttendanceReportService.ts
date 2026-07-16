import { and, eq, gte, lte } from "drizzle-orm";
import httpStatus from "http-status";
import { db } from "../config/dbConnection";
import { admissionApprovalStatus } from "../constants/enum";
import { admissionModel } from "../models/admissionModel";
import { admissionSessionModel } from "../models/admissionSession";
import { attendanceModel } from "../models/attendance";
import { studentModel } from "../models/studentModel";
import AppError from "../utils/AppError";
import { ManagerAttendanceReportInput } from "../validation/managerAttendanceReport.schema";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "NOT_MARKED" | "CONFLICT";

type AttendanceWarning =
  | {
      code: "DUPLICATE_ATTENDANCE_RECORDS";
      date: string;
      hostel: string;
      floor: number;
      recordIds: number[];
    }
  | {
      code: "DUPLICATE_ELIGIBLE_STUDENT";
      rollNo: string;
      admissionIds: number[];
    }
  | {
      code: "MISSING_STUDENT_ATTENDANCE_MAPPING";
      rollNo: string;
      reason: "MISSING_FLOOR" | "MISSING_HOSTEL_BLOCK";
    }
  | {
      code: "UNKNOWN_ABSENTEE_ROLL_NUMBERS";
      attendanceRecordId: number;
      date: string;
      hostel: string;
      floor: number;
      rollNumbers: string[];
    };

type EligibleStudent = {
  admissionId: number;
  rollNo: string;
  name: string;
  roomNumber: number | null;
  floor: number | null;
  hostelBlock: string | null;
};

type AttendanceRecord = {
  id: number;
  date: string;
  rcId: number;
  hostel: string;
  floor: number;
  absentee: string[];
};

type ReportStudent = Omit<EligibleStudent, "admissionId"> & {
  attendance: Record<string, AttendanceStatus>;
};

export type ManagerAttendanceReport = {
  filters: {
    fromDate: string;
    toDate: string;
    admissionSessionId: number;
    academicYear: string;
    hostelBlock: string;
  };
  dates: string[];
  students: ReportStudent[];
  summary: {
    studentCount: number;
    dateCount: number;
  };
  warnings: AttendanceWarning[];
};

const getLookupKey = (date: string, hostel: string, floor: number) =>
  `${date}|${hostel}|${floor}`;

const generateDateRange = (fromDate: string, toDate: string) => {
  const dates: string[] = [];
  const cursor = new Date(`${fromDate}T00:00:00.000Z`);
  const end = new Date(`${toDate}T00:00:00.000Z`);

  while (cursor.getTime() <= end.getTime()) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
};

const getAdmissionSessionAcademicYear = async (admissionSessionId: number) => {
  const [session] = await db
    .select({
      academicYear: admissionSessionModel.academic_year,
    })
    .from(admissionSessionModel)
    .where(eq(admissionSessionModel.id, admissionSessionId))
    .limit(1);

  if (!session) {
    throw AppError("Admission session not found", httpStatus.NOT_FOUND);
  }

  return session.academicYear;
};

const fetchEligibleStudents = async (academicYear: string, hostelBlock: string) => {
  return await db
    .select({
      admissionId: admissionModel.id,
      rollNo: studentModel.rollNo,
      name: studentModel.name,
      roomNumber: studentModel.roomNumber,
      floor: studentModel.floor,
      hostelBlock: studentModel.hostelBlock,
    })
    .from(admissionModel)
    .innerJoin(studentModel, eq(admissionModel.roll_number, studentModel.rollNo))
    .where(
      and(
        eq(admissionModel.academicYear, academicYear),
        eq(admissionModel.status, admissionApprovalStatus.WARDEN),
        eq(studentModel.hostelBlock, hostelBlock)
      )
    );
};

const fetchAttendanceRecords = async (
  fromDate: string,
  toDate: string,
  hostelBlock: string
) => {
  return await db
    .select({
      id: attendanceModel.id,
      date: attendanceModel.date,
      rcId: attendanceModel.rc_id,
      hostel: attendanceModel.hostel,
      floor: attendanceModel.floor,
      absentee: attendanceModel.absentee,
    })
    .from(attendanceModel)
    .where(
      and(
        gte(attendanceModel.date, fromDate),
        lte(attendanceModel.date, toDate),
        eq(attendanceModel.hostel, hostelBlock)
      )
    );
};

const deduplicateEligibleStudents = (
  rows: EligibleStudent[],
  warnings: AttendanceWarning[]
) => {
  const byRollNo = new Map<string, EligibleStudent>();
  const admissionIdsByRollNo = new Map<string, number[]>();

  rows.forEach((row) => {
    const existingAdmissionIds = admissionIdsByRollNo.get(row.rollNo) ?? [];
    admissionIdsByRollNo.set(row.rollNo, [...existingAdmissionIds, row.admissionId]);

    if (!byRollNo.has(row.rollNo)) {
      byRollNo.set(row.rollNo, row);
    }
  });

  admissionIdsByRollNo.forEach((admissionIds, rollNo) => {
    if (admissionIds.length > 1) {
      warnings.push({
        code: "DUPLICATE_ELIGIBLE_STUDENT",
        rollNo,
        admissionIds,
      });
    }
  });

  return Array.from(byRollNo.values());
};

const buildAttendanceLookup = (
  records: AttendanceRecord[],
  warnings: AttendanceWarning[]
) => {
  const groups = new Map<string, AttendanceRecord[]>();

  records.forEach((record) => {
    const key = getLookupKey(record.date, record.hostel, record.floor);
    const group = groups.get(key) ?? [];
    groups.set(key, [...group, record]);
  });

  const lookup = new Map<string, AttendanceRecord>();
  const conflictKeys = new Set<string>();

  groups.forEach((group, key) => {
    if (group.length === 1) {
      lookup.set(key, group[0]);
      return;
    }

    conflictKeys.add(key);
    const firstRecord = group[0];
    warnings.push({
      code: "DUPLICATE_ATTENDANCE_RECORDS",
      date: firstRecord.date,
      hostel: firstRecord.hostel,
      floor: firstRecord.floor,
      recordIds: group.map((record) => record.id),
    });
  });

  return { lookup, conflictKeys };
};

const addMappingWarnings = (
  students: EligibleStudent[],
  warnings: AttendanceWarning[]
) => {
  students.forEach((student) => {
    if (!student.hostelBlock) {
      warnings.push({
        code: "MISSING_STUDENT_ATTENDANCE_MAPPING",
        rollNo: student.rollNo,
        reason: "MISSING_HOSTEL_BLOCK",
      });
    }

    if (student.floor === null) {
      warnings.push({
        code: "MISSING_STUDENT_ATTENDANCE_MAPPING",
        rollNo: student.rollNo,
        reason: "MISSING_FLOOR",
      });
    }
  });
};

const addUnknownAbsenteeWarnings = (
  records: AttendanceRecord[],
  eligibleRollNumbers: Set<string>,
  warnings: AttendanceWarning[]
) => {
  records.forEach((record) => {
    const unknownRollNumbers = record.absentee.filter(
      (rollNo) => !eligibleRollNumbers.has(rollNo)
    );

    if (unknownRollNumbers.length > 0) {
      warnings.push({
        code: "UNKNOWN_ABSENTEE_ROLL_NUMBERS",
        attendanceRecordId: record.id,
        date: record.date,
        hostel: record.hostel,
        floor: record.floor,
        rollNumbers: Array.from(new Set(unknownRollNumbers)),
      });
    }
  });
};

export const generateManagerAttendanceReport = async (
  input: ManagerAttendanceReportInput
): Promise<ManagerAttendanceReport> => {
  const warnings: AttendanceWarning[] = [];
  const academicYear = await getAdmissionSessionAcademicYear(
    input.admissionSessionId
  );

  const [studentRows, attendanceRecords] = await Promise.all([
    fetchEligibleStudents(academicYear, input.hostelBlock),
    fetchAttendanceRecords(input.fromDate, input.toDate, input.hostelBlock),
  ]);

  const dates = generateDateRange(input.fromDate, input.toDate);
  const students = deduplicateEligibleStudents(studentRows, warnings);
  const eligibleRollNumbers = new Set(students.map((student) => student.rollNo));
  const { lookup, conflictKeys } = buildAttendanceLookup(
    attendanceRecords,
    warnings
  );

  addMappingWarnings(students, warnings);
  addUnknownAbsenteeWarnings(attendanceRecords, eligibleRollNumbers, warnings);

  const reportStudents = students.map<ReportStudent>((student) => {
    const attendance = dates.reduce<Record<string, AttendanceStatus>>(
      (accumulator, date) => {
        if (!student.hostelBlock || student.floor === null) {
          accumulator[date] = "NOT_MARKED";
          return accumulator;
        }

        const key = getLookupKey(date, student.hostelBlock, student.floor);

        if (conflictKeys.has(key)) {
          accumulator[date] = "CONFLICT";
          return accumulator;
        }

        const record = lookup.get(key);

        if (!record) {
          accumulator[date] = "NOT_MARKED";
          return accumulator;
        }

        accumulator[date] = record.absentee.includes(student.rollNo)
          ? "ABSENT"
          : "PRESENT";
        return accumulator;
      },
      {}
    );

    return {
      rollNo: student.rollNo,
      name: student.name,
      roomNumber: student.roomNumber,
      floor: student.floor,
      hostelBlock: student.hostelBlock,
      attendance,
    };
  });

  return {
    filters: {
      fromDate: input.fromDate,
      toDate: input.toDate,
      admissionSessionId: input.admissionSessionId,
      academicYear,
      hostelBlock: input.hostelBlock,
    },
    dates,
    students: reportStudents,
    summary: {
      studentCount: reportStudents.length,
      dateCount: dates.length,
    },
    warnings,
  };
};

