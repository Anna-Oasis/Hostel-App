import { z } from "zod";

// E.164 international phone number format
const internationalPhoneRegex = /^\+?[1-9]\d{1,14}$/;

// Postal code: 5 to 10 digits, numeric only (internationally safe)
const postalCodeRegex = /^\d{5,10}$/;

// Blood groups allowed: A+, A−, B+, B−, AB+, AB−, O+, O−
const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const studentSchema = z.object({
  // Basic Info
  name: z.string({ required_error: "Name is required" }).min(1, "Name cannot be empty"),
  rollNo: z.string({ required_error: "Roll number is required" }).min(1, "Roll number cannot be empty"),
  course: z.string({ required_error: "Course is required" }).min(1, "Course cannot be empty"),
  branch: z.string({ required_error: "Branch is required" }).min(1, "Branch cannot be empty"),
  semester: z.string({ required_error: "Semester is required" }).min(1, "Semester cannot be empty"),
  gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
  dateOfBirth: z.coerce.date({ required_error: "Date of Birth is required" }),

  mobile: z.string({ required_error: "Mobile number is required" }).regex(internationalPhoneRegex, "Invalid mobile number"),
  email: z.string({ required_error: "Email is required" }).email("Invalid email address"),
  emergencyContact: z.string({ required_error: "Emergency contact is required" }).regex(internationalPhoneRegex, "Invalid emergency contact"),

  nationality: z.string({ required_error: "Nationality is required" }).min(1, "Nationality cannot be empty"),
  govtId: z.string({ required_error: "Government ID is required" }).min(1, "Government ID cannot be empty"),
  govtIdType: z.string({ required_error: "Government ID type is required" }).min(1, "Government ID type cannot be empty"),
  bloodGroup: z.string({ required_error: "Blood group is required" }).min(2, "Invalid blood group"),
  medicalHistory: z.string().optional(),
  admissionCategory: z.string({ required_error: "Admission category is required" }).min(1, "Admission category cannot be empty"),

  // Father Info
  fatherName: z.string({ required_error: "Father's name is required" }).min(1, "Father's name cannot be empty"),
  fatherOccupation: z.string({ required_error: "Father's occupation is required" }).min(1, "Father's occupation cannot be empty"),
  fatherMobile: z.string({ required_error: "Father's mobile is required" }).regex(internationalPhoneRegex, "Invalid father's mobile number"),
  fatherEmail: z.string({ required_error: "Father's email is required" }).email("Invalid father's email address"),
  fatherCountry: z.string({ required_error: "Father's country is required" }).min(1, "Father's country cannot be empty"),

  // Mother Info
  motherName: z.string({ required_error: "Mother's name is required" }).min(1, "Mother's name cannot be empty"),
  motherOccupation: z.string({ required_error: "Mother's occupation is required" }).min(1, "Mother's occupation cannot be empty"),
  motherMobile: z.string({ required_error: "Mother's mobile is required" }).regex(internationalPhoneRegex, "Invalid mother's mobile number"),
  motherEmail: z.string({ required_error: "Mother's email is required" }).email("Invalid mother's email address"),
  motherCountry: z.string({ required_error: "Mother's country is required" }).min(1, "Mother's country cannot be empty"),

  // India Address
  resIndiaHouseNo: z.string({ required_error: "House No (India) is required" }).min(1, "House No cannot be empty"),
  resIndiaStreet: z.string({ required_error: "Street (India) is required" }).min(1, "Street cannot be empty"),
  resIndiaCity: z.string({ required_error: "City (India) is required" }).min(1, "City cannot be empty"),
  resIndiaState: z.string({ required_error: "State (India) is required" }).min(1, "State cannot be empty"),
  resIndiaCountry: z.string({ required_error: "Country (India) is required" }).min(1, "Country cannot be empty"),
  resIndiaPostalCode: z.string({ required_error: "Postal Code (India) is required" }).regex(postalCodeRegex, "Invalid India postal code"),

  // Foreign Address
  resForeignHouseNo: z.string({ required_error: "House No (Foreign) is required" }).min(1, "Foreign house number cannot be empty"),
  resForeignStreet: z.string({ required_error: "Street (Foreign) is required" }).min(1, "Foreign street cannot be empty"),
  resForeignCity: z.string({ required_error: "City (Foreign) is required" }).min(1, "Foreign city cannot be empty"),
  resForeignState: z.string({ required_error: "State (Foreign) is required" }).min(1, "Foreign state cannot be empty"),
  resForeignCountry: z.string({ required_error: "Country (Foreign) is required" }).min(1, "Foreign country cannot be empty"),
  resForeignPostalCode: z.string({ required_error: "Postal Code (Foreign) is required" }).regex(postalCodeRegex, "Invalid foreign postal code"),

  // Local Guardian
  localGuardianName: z.string({ required_error: "Local guardian name is required" }).min(1, "Guardian name cannot be empty"),
  localGuardianRelationship: z.string({ required_error: "Guardian relationship is required" }).min(1, "Relationship cannot be empty"),
  localGuardianMobile: z.string({ required_error: "Guardian mobile is required" }).regex(internationalPhoneRegex, "Invalid guardian mobile number"),
  localGuardianEmail: z.string({ required_error: "Guardian email is required" }).email("Invalid guardian email"),

  // Guardian Address
  guardianHouseNo: z.string({ required_error: "Guardian house number is required" }).min(1, "Guardian house number cannot be empty"),
  guardianStreet: z.string({ required_error: "Guardian street is required" }).min(1, "Guardian street cannot be empty"),
  guardianCity: z.string({ required_error: "Guardian city is required" }).min(1, "Guardian city cannot be empty"),
  guardianState: z.string({ required_error: "Guardian state is required" }).min(1, "Guardian state cannot be empty"),
  guardianCountry: z.string({ required_error: "Guardian country is required" }).min(1, "Guardian country cannot be empty"),
  guardianPostalCode: z.string({ required_error: "Guardian postal code is required" }).regex(postalCodeRegex, "Invalid guardian postal code"),

  // Uploads
  passportPhotoUrl: z.string({ required_error: "Passport photo URL is required" }).min(1, "Passport photo URL cannot be empty"),
  studentSignatureUrl: z.string({ required_error: "Student signature URL is required" }).min(1, "Student signature URL cannot be empty"),
  parentGuardianSignatureUrl: z.string({ required_error: "Parent/Guardian signature URL is required" }).min(1, "Parent/Guardian signature URL cannot be empty"),
  admissionSlipUrl: z.string({ required_error: "Admission slip URL is required" }).min(1, "Admission slip URL cannot be empty"),
  categoryProofUrl: z.string({ required_error: "Category proof URL is required" }).min(1, "Category proof URL cannot be empty"),

  // Timestamp
  createdAt: z.coerce.date({ required_error: "Created date is required" }).default(() => new Date()),
});

export const studentsSchema = z.object({
  // Basic Info
  name: z.string().min(1),
  rollNo: z.string().min(1),
  course: z.string().min(1),
  branch: z.string().min(1),
  semester: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.coerce.date(),

  mobile: z.string().regex(internationalPhoneRegex, "Invalid mobile number"),
  email: z.string().email("Invalid email"),
  emergencyContact: z.string().regex(internationalPhoneRegex, "Invalid emergency contact"),

  nationality: z.string().min(1),
  govtId: z.string().min(1),
  govtIdType: z.string().min(1),
  /*bloodGroup: z.enum(validBloodGroups as [string, ...string[]], {
    required_error: "Blood group is required",
    invalid_type_error: "Invalid blood group",
  }),*/
  bloodGroup: z.string().min(2),
  medicalHistory: z.string().optional(),
  admissionCategory: z.string().min(1),

  // Father Info
  fatherName: z.string().min(1),
  fatherOccupation: z.string().min(1),
  fatherMobile: z.string().regex(internationalPhoneRegex, "Invalid father's mobile"),
  fatherEmail: z.string().email("Invalid father's email"),
  fatherCountry: z.string().min(1),

  // Mother Info
  motherName: z.string().min(1),
  motherOccupation: z.string().min(1),
  motherMobile: z.string().regex(internationalPhoneRegex, "Invalid mother's mobile"),
  motherEmail: z.string().email("Invalid mother's email"),
  motherCountry: z.string().min(1),

  // India Address
  resIndiaHouseNo: z.string().min(1),
  resIndiaStreet: z.string().min(1),
  resIndiaCity: z.string().min(1),
  resIndiaState: z.string().min(1),
  resIndiaCountry: z.string().min(1),
  resIndiaPostalCode: z.string().regex(postalCodeRegex, "Invalid India postal code"),

  // Foreign Address (all required now)
  resForeignHouseNo: z.string().min(1),
  resForeignStreet: z.string().min(1),
  resForeignCity: z.string().min(1),
  resForeignState: z.string().min(1),
  resForeignCountry: z.string().min(1),
  resForeignPostalCode: z.string().regex(postalCodeRegex, "Invalid foreign postal code"),

  // Local Guardian (all required now)
  localGuardianName: z.string().min(1),
  localGuardianRelationship: z.string().min(1),
  localGuardianMobile: z.string().regex(internationalPhoneRegex, "Invalid guardian mobile"),
  localGuardianEmail: z.string().email("Invalid guardian email"),

  // Guardian Address
  guardianHouseNo: z.string().min(1),
  guardianStreet: z.string().min(1),
  guardianCity: z.string().min(1),
  guardianState: z.string().min(1),
  guardianCountry: z.string().min(1),
  guardianPostalCode: z.string().regex(postalCodeRegex, "Invalid guardian postal code"),

  // Uploads
  passportPhotoUrl: z.string().min(1),
  studentSignatureUrl: z.string().min(1),
  parentGuardianSignatureUrl: z.string().min(1),
  admissionSlipUrl: z.string().min(1),
  categoryProofUrl: z.string().min(1),

  // Timestamp
  createdAt: z.coerce.date().default(() => new Date()),
});


export const studentDetailsDecisionSchema = z.object({
  approve: z.boolean(),
  comment: z.string().optional(),
});