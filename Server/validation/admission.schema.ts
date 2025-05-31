import { z } from "zod";
import { approval_status ,ApprovalStatus} from "../models/enum";

export const admissionSchema = z.object({
  user_id: z.coerce.number(),
approval: z.enum([
    approval_status.submitted,
    approval_status.rc,
    approval_status.manager,
    approval_status.deputyWarden,
    approval_status.executiveWarden
  ] as [ApprovalStatus, ...ApprovalStatus[]]).default(approval_status.submitted),
  transactionId: z.string(),

  name: z.string(),
  rollNo: z.string(),
  course: z.string(),
  branch: z.string(),
  semester: z.string(),
  dateOfBirth: z.coerce.date(),
  age: z.coerce.number(),
  mobile: z.string(),
  email: z.string().email(),
  emergencyContact: z.string(),
  nationality: z.string(),
  govtId: z.string(),
  admissionCategory: z.string(),
  bloodGroup: z.string(),
  medicalHistory: z.string(),

  previousResident: z.coerce.boolean(),
  hostelBlock: z.string(),
  roomNumber: z.string().default(""),
  messPreference: z.string(),

  fatherName: z.string(),
  fatherOccupation: z.string(),
  fatherMobile: z.string(),
  fatherEmail: z.string().email(),
  fatherCountry: z.string(),

  motherName: z.string(),
  motherOccupation: z.string(),
  motherMobile: z.string(),
  motherEmail: z.string().email(),
  motherCountry: z.string(),

  // Residential India address (flat)
  resIndiaHouseNo: z.string(),
  resIndiaStreet: z.string(),
  resIndiaCity: z.string(),
  resIndiaState: z.string(),
  resIndiaCountry: z.string(),
  resIndiaPostalCode: z.string(),

  // Residential Foreign address (optional flat)
  resForeignHouseNo: z.string().optional(),
  resForeignStreet: z.string().optional(),
  resForeignCity: z.string().optional(),
  resForeignState: z.string().optional(),
  resForeignCountry: z.string().optional(),
  resForeignPostalCode: z.string().optional(),

  // Local Guardian (optional flat)
  localGuardianName: z.string().optional(),
  localGuardianRelationship: z.string().optional(),
  localGuardianMobile: z.string().optional(),
  localGuardianEmail: z.string().email().optional(),

  guardianHouseNo: z.string().optional(),
  guardianStreet: z.string().optional(),
  guardianCity: z.string().optional(),
  guardianState: z.string().optional(),
  guardianCountry: z.string().optional(),
  guardianPostalCode: z.string().optional(),

  studentDeclaration: z.coerce.boolean(),
  parentDeclaration: z.coerce.boolean(),

  //images
  passportPhotoUrl: z.string().optional(),
  studentSignatureUrl: z.string().optional(),
  parentGuardianSignatureUrl: z.string().optional(),

  createdAt: z.coerce.date().default(() => new Date()),
});
