import { Admission } from "../models/admissionModel";
import { Student } from "../models/studentModel";
import { HtmlTemplateData } from "./htmlTemplateService";

type ApplicationFormAdmission = Pick<
  Admission,
  "hostelBlock" | "messPreference" | "previousResident"
>;

type FeeReceiptAdmission = Pick<
  Admission,
  "previousResident" | "transaction_id" | "submission_Date"
>;

function valueOrEmpty(value: unknown): string {
  return value === null || value === undefined ? "" : String(value);
}

function isSameValue(value: unknown, expected: string): boolean {
  return valueOrEmpty(value).toLowerCase() === expected.toLowerCase();
}

function yesNo(condition: boolean): string {
  return condition ? "Yes" : "No";
}

function calculateAge(dateOfBirth: Student["dateOfBirth"]): string {
  if (!dateOfBirth) return "";

  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return "";

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age -= 1;
  }

  return `(${age})`;
}

function calculateYear(semester: Student["semester"]): string {
  const semesterNumber = Number(semester);
  if (!Number.isFinite(semesterNumber) || semesterNumber <= 0) return "";

  return String(Math.ceil(semesterNumber / 2));
}

function getCourseDurationYears(course: Student["course"]): number {
  return isSameValue(course, "B.Arch") ? 5 : 4;
}

/**
 * Anna University roll numbers lead with the admission year (e.g. "2024115098"),
 * so the course span can be derived without a separate stored field.
 */
function getAcademicYearRange(
  rollNo: Student["rollNo"],
  course: Student["course"]
): string {
  const admissionYear = Number(valueOrEmpty(rollNo).slice(0, 4));
  if (!Number.isFinite(admissionYear) || admissionYear <= 0) return "";

  const graduationYear = admissionYear + getCourseDurationYears(course);
  return `${admissionYear} - ${graduationYear}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

function joinAddressParts(parts: unknown[]): string {
  return parts.map(valueOrEmpty).filter(Boolean).join(", ");
}

export function buildApplicationFormData(
  student: Student,
  admission?: ApplicationFormAdmission | null
): HtmlTemplateData {
  const hostelBlock = admission?.hostelBlock ?? student.hostelBlock;
  const previousResident = admission?.previousResident;
  const messPreference = admission?.messPreference;

  return {
    name: student.name,
    rollNo: student.rollNo,
    course: student.course,
    branch: student.branch,
    semester: student.semester,
    mobile: student.mobile,
    email: student.email,

    fatherName: student.fatherName,
    fatherMobile: student.fatherMobile,
    fatherEmail: student.fatherEmail,
    fatherOccupation: student.fatherOccupation,
    fatherCountry: student.fatherCountry,

    motherName: student.motherName,
    motherMobile: student.motherMobile,
    motherEmail: student.motherEmail,
    motherOccupation: student.motherOccupation,
    motherCountry: student.motherCountry,

    resIndiaHouseNo: student.resIndiaHouseNo,
    resIndiaStreet: student.resIndiaStreet,
    resIndiaCity: student.resIndiaCity,
    resIndiaState: student.resIndiaState,
    resIndiaCountry: student.resIndiaCountry,
    resIndiaPostalCode: student.resIndiaPostalCode,

    resForeignHouseNo: student.resForeignHouseNo,
    resForeignStreet: student.resForeignStreet,
    resForeignCity: student.resForeignCity,
    resForeignState: student.resForeignState,
    resForeignPostalCode: student.resForeignPostalCode,

    localGuardianName: student.localGuardianName,
    localGuardianRelationship: student.localGuardianRelationship,
    localGuardianMobile: student.localGuardianMobile,
    localGuardianEmail: student.localGuardianEmail,

    guardianHouseNo: student.guardianHouseNo,
    guardianStreet: student.guardianStreet,
    guardianCity: student.guardianCity,
    guardianState: student.guardianState,
    guardianPostalCode: student.guardianPostalCode,

    hostelBlock,
    roomNumber: student.roomNumber,
    dateOfBirth: student.dateOfBirth,
    age: calculateAge(student.dateOfBirth),
    admissionCategory: student.admissionCategory,
    govtIdType: student.govtIdType,
    govtId: student.govtId,
    nationality: student.nationality,
    bloodGroup: student.bloodGroup,
    medicalHistory: student.medicalHistory,
    emergencyContact: student.emergencyContact,

    floraHostelChecked: yesNo(isSameValue(hostelBlock, "Flora")),
    lavenderHostelChecked: yesNo(isSameValue(hostelBlock, "Lavender")),
    previousResidentYes: yesNo(previousResident === true),
    previousResidentNo: yesNo(previousResident === false),
    vegetarianMessChecked: yesNo(isSameValue(messPreference, "Vegetarian")),
    nonVegetarianMessChecked: yesNo(
      isSameValue(messPreference, "Non-Vegetarian")
    ),

  };
}

export function buildRoomAllotmentFormData(
  student: Student
): HtmlTemplateData {
  return {
    name: student.name,
    year: calculateYear(student.semester),
    branch: student.branch,
    admissionCategory: student.admissionCategory,
    roomNumber: student.roomNumber,
  };
}

export function buildReAdmissionFormData(
  student: Student,
  admission?: ApplicationFormAdmission | null
): HtmlTemplateData {
  const hostelBlock = admission?.hostelBlock ?? student.hostelBlock;

  return {
    name: student.name,
    rollNo: student.rollNo,
    course: student.course,
    branch: student.branch,
    year: calculateYear(student.semester),
    semester: student.semester,
    mobile: student.mobile,
    email: student.email,
    fatherMobile: student.fatherMobile,
    motherMobile: student.motherMobile,
    parentEmail: student.fatherEmail || student.motherEmail,
    localGuardianName: student.localGuardianName,
    localGuardianMobile: student.localGuardianMobile,
    localGuardianAddress: joinAddressParts([
      student.guardianHouseNo,
      student.guardianStreet,
      student.guardianCity,
      student.guardianState,
      student.guardianPostalCode,
    ]),
    roomNumber: student.roomNumber,
    floraHostelChecked: yesNo(isSameValue(hostelBlock, "Flora")),
    lavenderHostelChecked: yesNo(isSameValue(hostelBlock, "Lavender")),
  };
}

export function buildFeeReceiptData(
  student: Student,
  admission: FeeReceiptAdmission,
  receiptNo: string
): HtmlTemplateData {
  const now = new Date();
  const amount = admission.previousResident ? "96,300" : "1,16,300";

  return {
    receiptNo,
    name: student.name,
    rollNo: student.rollNo,
    category: student.admissionCategory,
    course: student.course,
    year: calculateYear(student.semester),
    branch: student.branch,
    semester: student.semester,
    academicYear: getAcademicYearRange(student.rollNo, student.course),
    refId: admission.transaction_id,
    date: formatDate(now),
    amount,
    dateOfGeneration: formatDateTime(now),
  };
}
