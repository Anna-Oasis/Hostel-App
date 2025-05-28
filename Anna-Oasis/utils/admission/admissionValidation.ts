import * as Yup from "yup";
const phoneRegex = /^[6-9]\d{9}$/;
const pinRegex = /^\d{6}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const allowedBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const validationSchemas = [
  Yup.object({
    name: Yup.string().trim().min(2).required("Required"),
    rollNo: Yup.number().typeError("Must be a number").required("Required"),
    course: Yup.string().required("Required"),
    branch: Yup.string().required("Required"),
    semester: Yup.string().required("Required"),
    dateOfBirth: Yup.string().matches(dateRegex, "Use YYYY-MM-DD").required("Required"),
    age: Yup.number().min(15).max(99).required("Required"),
    mobile: Yup.string().matches(phoneRegex, "Invalid number").required("Required"),
    emergencyContact: Yup.string().matches(phoneRegex, "Invalid number").required("Required"),
    email: Yup.string().email().required("Required"),
    nationality: Yup.string().required("Required"),
    govtId: Yup.string().required("Required"),
    admissionCategory: Yup.string().required("Required"),
    bloodGroup: Yup.string()
      .oneOf(allowedBloodGroups, "Invalid blood group")
      .required("Required"),
    medicalHistory: Yup.string(),
    previousResident: Yup.string().required("Required"),
    hostelBlock: Yup.string().required("Required"),
  }),
  Yup.object({
    fatherName: Yup.string().required("Required"),
    fatherContactLocal: Yup.string().matches(phoneRegex, "Invalid").required("Required"),
    fatherContactForeign: Yup.string(),
    motherName: Yup.string().required("Required"),
    motherContactLocal: Yup.string().matches(phoneRegex, "Invalid").required("Required"),
    landline: Yup.string(),
    parentEmail: Yup.string().email().required("Required"),
    occupation: Yup.string().required("Required"),
    residentialAddress: Yup.string().required("Required"),
    pin: Yup.string().matches(pinRegex, "Invalid PIN").required("Required"),
  }),
   Yup.object({
    guardianName: Yup.string().required("Required"),
    guardianOccupation: Yup.string().required("Required"),
    guardianResidentialAddress: Yup.string().required("Required"),
    guardianPin: Yup.string().matches(pinRegex, "Invalid PIN").required("Required"),
    guardianMobile: Yup.string().matches(phoneRegex, "Invalid mobile number").required("Required"),
    guardianLandline: Yup.string(),
    guardianEmail: Yup.string().email("Invalid email").required("Required"),
  }),
  Yup.object({
    hostelBlock: Yup.string().required("Required"),
    roomNumber: Yup.string().required("Required"),
    messPreference: Yup.string().required("Required"),
    declaration: Yup.array().of(Yup.string()).min(1, "Required"),
    passportPhoto: Yup.string().required("Required"),
    studentSignature: Yup.string().required("Required"),
    parentGuardianSignature: Yup.string().required("Required"),
  }),
];
export default validationSchemas;