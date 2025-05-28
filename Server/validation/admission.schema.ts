import { z } from 'zod';

export const admissionSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  rollNo: z.string().min(6, 'Roll number must be at least 6 characters'),
  course: z.string().min(2, 'Course must be at least 2 characters'),
  branch: z.string().min(2, 'Branch must be at least 2 characters'),
  semester: z.string().min(1, 'Semester is required'),
  dateOfBirth: z.string().refine(
    (val) => !isNaN(new Date(val).getTime()),
    { message: 'Invalid date format for dateOfBirth' }
  ),
  age: z.number().int().min(15, 'Age must be at least 15').max(100, 'Age must be less than 100'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  email: z.string().email('Invalid email format'),
  admissionCategory: z.string().min(1, 'Admission category is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  medicalHistory: z.string().min(1, 'Medical history is required'),
  previousResident: z.boolean(),
  fatherName: z.string().min(1, 'Father name is required'),
  fatherContactLocal: z.string().min(10, 'Father local contact is required'),
  fatherContactForeign: z.string().min(10).optional(),
  motherName: z.string().min(1, 'Mother name is required'),
  motherContactLocal: z.string().min(10, 'Mother local contact is required'),
  landline: z.string().min(10).optional(),
  parentEmail: z.string().email('Invalid parent email format'),
  occupation: z.string().min(1, 'Occupation is required'),
  residentialAddress: z.string().min(1, 'Residential address is required'),
  pin: z.string().min(6, 'PIN code must be at least 6 characters'),
  guardianName: z.string().min(1).optional(),
  guardianOccupation: z.string().min(1).optional(),
  guardianResidentialAddress: z.string().min(1).optional(),
  guardianPin: z.string().min(6).optional(),
  guardianMobile: z.string().min(10).optional(),
  guardianLandline: z.string().min(10).optional(),
  guardianEmail: z.string().email().optional(),
  hostelBlock: z.string().min(1, 'Hostel block is required'),
  roomNumber: z.string().min(1, 'Room number is required'),
  messPreference: z.enum(['Veg', 'Non-Veg'], {
    errorMap: () => ({ message: 'Mess preference must be Veg or Non-Veg' }),
  }),
  declaration: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Declaration must be valid JSON' }
  ),
});