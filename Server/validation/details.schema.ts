import { z } from "zod";

export const studentSchema = z.object({
  user_id: z.coerce.number(),
  // Basic Info
  name: z.string().min(1),
  rollNo: z.string().min(1),
  course: z.string().min(1),
  branch: z.string().min(1),
  semester: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),

  dateOfBirth: z.coerce.date(),
  mobile: z.string().regex(/^(\+\d{1,3})?\d{10}$/, "Invalid mobile number"),
  email: z.string().email(),
  emergencyContact: z.string().regex(/^(\+\d{1,3})?\d{10}$/, "Invalid emergency contact"),

  nationality: z.string(),
  govtId: z.string(),
  govtIdType: z.string(),
  bloodGroup: z.string(),
  medicalHistory: z.string(),
  admissionCategory: z.string().min(1, "Admission category is required"),
  
  // Father Info
  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherMobile: z.string().regex(/^(\+\d{1,3})?\d{10}$/, "Invalid father's mobile"),
  fatherEmail: z.string().email(),
  fatherCountry: z.string(),

  // Mother Info
  motherName: z.string(),
  motherOccupation: z.string(),
  motherMobile: z.string().regex(/^(\+\d{1,3})?\d{10}$/, "Invalid mother's mobile"),
  motherEmail: z.string().email(),
  motherCountry: z.string(),

  // India Address
  resIndiaHouseNo: z.string(),
  resIndiaStreet: z.string(),
  resIndiaCity: z.string(),
  resIndiaState: z.string(),
  resIndiaCountry: z.string(),
  resIndiaPostalCode: z.string(),

  // Foreign Address (optional)
  resForeignHouseNo: z.string().optional(),
  resForeignStreet: z.string().optional(),
  resForeignCity: z.string().optional(),
  resForeignState: z.string().optional(),
  resForeignCountry: z.string().optional(),
  resForeignPostalCode: z.string().optional(),

  // Local Guardian (optional)
  localGuardianName: z.string().optional(),
  localGuardianRelationship: z.string().optional(),
  localGuardianMobile: z
    .string()
    .regex(/^(\+\d{1,3})?\d{10}$/, "Invalid guardian mobile")
    .or(z.literal("")).optional(),
  localGuardianEmail: z.string().email().optional(),

  // Guardian Address (optional)
  guardianHouseNo: z.string().optional(),
  guardianStreet: z.string().optional(),
  guardianCity: z.string().optional(),
  guardianState: z.string().optional(),
  guardianCountry: z.string().optional(),
  guardianPostalCode: z.string().optional(),

  // Uploads (optional)
  passportPhotoUrl: z.string().optional(),
  studentSignatureUrl: z.string().optional(),
  parentGuardianSignatureUrl: z.string().optional(),
  admissionSlipUrl: z.string().optional(),
  categoryProofUrl: z.string().optional(),

  createdAt: z.coerce.date().default(() => new Date()),
});

export const studentDetailsDecisionSchema = z.object({
  approve: z.boolean(),
  comment: z.string().optional(),
});