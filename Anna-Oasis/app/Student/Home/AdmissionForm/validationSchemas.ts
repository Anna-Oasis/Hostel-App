import * as Yup from "yup";
const phoneRegex = /^[6-9]\d{9}$/;
const pinRegex = /^\d{6}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const validationSchemas = [
  Yup.object({
    name: Yup.string().trim().min(2).required("Required"),
    rollNo: Yup.string().required("Required"),
    course: Yup.string().required("Required"),
    branch: Yup.string().required("Required"),
    semester: Yup.string().required("Required"),
    dateOfBirth: Yup.string().matches(dateRegex, "Use YYYY-MM-DD").required("Required"),
    age: Yup.number().min(15).max(99).required("Required"),
    mobile: Yup.string().matches(phoneRegex, "Invalid number").required("Required"),
    email: Yup.string().email().required("Required"),
    admissionCategory: Yup.string().required("Required"),
    bloodGroup: Yup.string().required("Required"),
    medicalHistory: Yup.string(),
    previousResident: Yup.string().required("Required"),
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
  Yup.object({}),
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