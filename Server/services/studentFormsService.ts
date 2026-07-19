import { Admission } from "../models/admissionModel";
import { Student } from "../models/studentModel";
import { HtmlTemplateData } from "./htmlTemplateService";

type ApplicationFormAdmission = Admission

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

    // passportPhoto : student.passportPhotoUrl,

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

    hostelBlock : hostelBlock,
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

    // floraHostelChecked: yesNo(isSameValue(hostelBlock, "Flora")),
    // lavenderHostelChecked: yesNo(isSameValue(hostelBlock, "Lavender")),
    previousResidentYes: yesNo(previousResident === true),
    // previousResidentNo: yesNo(previousResident === false),
    mess: messPreference,
    // nonVegetarianMessChecked: yesNo(
    //   isSameValue(messPreference, "Non-Vegetarian")
    // ),

  };
}

export function buildRoomAllotmentFormData(
  student: Student
): HtmlTemplateData {
  console.log(student.admissionCategory)
  return {
    name: student.name,
    year: calculateYear(student.semester),
    branch: student.branch,
    admissionCategory: student.admissionCategory,
    hostelBlock : student.hostelBlock,
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
    hostelBlock : student.hostelBlock,
    transactionId : admission?.transaction_id
  };
}
