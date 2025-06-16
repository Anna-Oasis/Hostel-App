import * as Yup from "yup";
const phoneRegex = /^\+[1-9]\d{1,14}$/;
const pinRegex = /^[0-9\s\-]{3,10}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const allowedBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const validationSchemas = [
  // Student Details
  Yup.object({
    name: Yup.string().trim().min(2).required("Required"),
    rollNo: Yup.string().required("Required"),
    course: Yup.string().required("Required"),
    branch: Yup.string().required("Required"),
    semester: Yup.string().required("Required"),
    mobile: Yup.string().matches(phoneRegex, "Include country code (e.g., +91...)").required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    emergencyContact: Yup.string().matches(phoneRegex, "Include country code (e.g., +91...)").required("Required"),
    dateOfBirth: Yup.string().matches(dateRegex, "Use YYYY-MM-DD").required("Required"),
    age: Yup.number().min(15).max(99).required("Required"),
    gender: Yup.string().oneOf(["Male", "Female", "Other"], "Please select a gender").required("Required"),
    nationality: Yup.string().required("Required"),
    bloodGroup: Yup.string()
      .oneOf(allowedBloodGroups, "Invalid blood group")
      .required("Required"),
    medicalHistory: Yup.string(),
  }),
  // Parent Details (Father, Mother, Residential India, Residential Foreign)
  Yup.object({
    // Father
    fatherName: Yup.string().required("Required"),
    fatherOccupation: Yup.string().required("Required"),
    fatherMobile: Yup.string().matches(phoneRegex, "Invalid mobile").required("Required"),
    fatherEmail: Yup.string().email("Invalid email").required("Required"),
    fatherCountry: Yup.string().required("Required"),
    // Mother
    motherName: Yup.string().required("Required"),
    motherOccupation: Yup.string().required("Required"),
    motherMobile: Yup.string().matches(phoneRegex, "Invalid mobile").required("Required"),
    motherEmail: Yup.string().email("Invalid email").required("Required"),
    motherCountry: Yup.string().required("Required"),
    // Residential India
    resIndiaHouseNo: Yup.string().required("Required"),
    resIndiaStreet: Yup.string().required("Required"),
    resIndiaCity: Yup.string().required("Required"),
    resIndiaState: Yup.string().required("Required"),
    resIndiaPostalCode: Yup.string().matches(pinRegex, "Invalid PIN").required("Required"),
    // Residential Foreign
    resForeignHouseNo: Yup.string().required("Required"),
    resForeignStreet: Yup.string().required("Required"),
    resForeignCity: Yup.string().required("Required"),
    resForeignState: Yup.string().required("Required"),
    resForeignCountry: Yup.string().required("Required"),
    resForeignPostalCode: Yup.string().required("Required"),
  }),
  // Local Guardian
  Yup.object({
    guardianName: Yup.string().required("Required"),
    guardianRelationship: Yup.string().required("Required"),
    guardianMobile: Yup.string().matches(phoneRegex, "Invalid mobile number").required("Required"),
    guardianEmail: Yup.string().email("Invalid email").required("Required"),
    guardianHouseNo: Yup.string().required("Required"),
    guardianStreet: Yup.string().required("Required"),
    guardianCity: Yup.string().required("Required"),
    guardianState: Yup.string().required("Required"),
    guardianCountry: Yup.string().required("Required"),
    guardianPostalCode: Yup.string().matches(pinRegex, "Invalid PIN").required("Required"),
  }),
  // File Uploads
  Yup.object({
    isForeignNational: Yup.string().oneOf(["Yes", "No"], "Please select an option").required("Required"),
    govtId: Yup.string().required("Required"),
    govtIdType: Yup.string().required("Required"),
    categoryProofUrl: Yup.string().required("Required"),
    passportPhotoUrl: Yup.string().required("Required"),
    studentSignatureUrl: Yup.string().required("Required"),
    parentGuardianSignatureUrl: Yup.string().required("Required"),
    aadhaarUrl: Yup.string().required("Required"),
    admissionSlipUrl: Yup.string().required("Required"),
  }),
];

export default validationSchemas;