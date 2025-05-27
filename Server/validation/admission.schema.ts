import { z } from "zod";

export const admissionSchema = z.object({
  name: z.string().min(3),
  rollNo: z.string().min(6),
  course: z.string().min(2),
  branch: z.string().min(2),
  semester: z.string().min(1),
  dateOfBirth: z.string().min(1),
  age: z.number(),
  mobile: z.string().min(10),
  email: z.string().email(),
  admissionCategory: z.string().min(1),
  bloodGroup: z.string().min(1),
  medicalHistory: z.string(),
  previousResident: z.boolean(),
  fatherName: z.string().min(1),
  fatherContactLocal: z.string().min(1),
  motherName: z.string().min(1),
  motherContactLocal: z.string().min(1),
  parentEmail: z.string().email(),
  occupation: z.string().min(1),
  residentialAddress: z.string().min(1),
  pin: z.string().min(1),
  hostelBlock: z.string().min(1),
  roomNumber: z.string().min(1),
  messPreference: z.string().min(1),
  declaration: z.any(),
  
  // File fields will be handled by multer, not zod
});