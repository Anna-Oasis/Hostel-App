const Departments = [
  { label: "Chemistry", value: "Chemistry" },
  { label: "Civil Engineering", value: "Civil Engineering" },
  {
    label: "Computer Science and Engineering",
    value: "Computer Science and Engineering",
  },
  {
    label: "Electrical and Electronics Engineering",
    value: "Electrical and Electronics Engineering",
  },
  {
    label: "Electronics and Communication Engineering",
    value: "Electronics and Communication Engineering",
  },
  { label: "English", value: "English" },
  { label: "Geology", value: "Geology" },
  { label: "Industrial Engineering", value: "Industrial Engineering" },
  {
    label: "Information Science and Technology",
    value: "Information Science and Technology",
  },
  { label: "Management Studies", value: "Management Studies" },
  { label: "Manufacturing Engineering", value: "Manufacturing Engineering" },
  { label: "Mathematics", value: "Mathematics" },
  { label: "Mechanical Engineering", value: "Mechanical Engineering" },
  { label: "Media Sciences", value: "Media Sciences" },
  { label: "Medical Physics", value: "Medical Physics" },
  { label: "Mining Engineering", value: "Mining Engineering" },
  { label: "Physics", value: "Physics" },
  { label: "Printing Engineering", value: "Printing Engineering" },
  {
    label: "Applied Science and Technology",
    value: "Applied Science and Technology",
  },
  {
    label: "Bio-Technology",
    value: "Bio-Technology",
  },
  {
    label: "Chemical Engineering",
    value: "Chemical Engineering",
  },
  {
    label: "Ceramic Technology",
    value: "Ceramic Technology",
  },
  {
    label: "Textile Technology",
    value: "Textile Technology",
  },
  {
    label: "Leather Technology",
    value: "Leather Technology",
  },
  {
    label: "Aeronautical Engineering",
    value: "Aeronautical Engineering",
  },
  {
    label: "Automobile Engineering",
    value: "Automobile Engineering",
  },
  {
    label: "Electronics Engineering",
    value: "Electronics Engineering",
  },
  {
    label: "Instrumentation Engineering",
    value: "Instrumentation Engineering",
  },
  {
    label: "Production Technology",
    value: "Production Technology",
  },
  {
    label: "Rubber and Plastics Technology",
    value: "Rubber and Plastics Technology",
  },
  {
    label: "Information Technology",
    value: "Information Technology",
  },
  {
    label: "Computer Technology",
    value: "Computer Technology",
  },
  {
    label: "Applied Science and Humanities",
    value: "Applied Science and Humanities",
  },
  {
    label: "Architecture",
    value: "Architecture",
  },
  {
    label: "Planning",
    value: "Planning",
  },
];

const campusList = [
  { label: "CEG", value: "CEG" },
  { label: "MIT", value: "MIT" },
  { label: "ACT", value: "ACT" },
  { label: "SAP", value: "SAP" },
];

const courses = [
  { label: "B.E.", value: "B.E." },
  { label: "B.Tech", value: "B.Tech" },
  { label: "B.Arch", value: "B.Arch" },
];

const semesters = [
  { label: "Semester 1", value: "Semester 1" },
  { label: "Semester 2", value: "Semester 2" },
  { label: "Semester 3", value: "Semester 3" },
  { label: "Semester 4", value: "Semester 4" },
  { label: "Semester 5", value: "Semester 5" },
  { label: "Semester 6", value: "Semester 6" },
  { label: "Semester 7", value: "Semester 7" },
  { label: "Semester 8", value: "Semester 8" },
];

const admissionCategories = [
  { label: "NRI", value: "NRI" },
  { label: "CIWGC", value: "CIWGC" },
  { label: "FN", value: "FN" },
  { label: "LDC", value: "LDC" },
  { label: "SIDS", value: "SIDS" },
];

const bloodGroups = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

const initialValues = {
  name: "",
  rollNo: "",
  course: "",
  branch: "",
  semester: "",
  mobile: "",
  email: "",
  emergencyContact: "",
  dateOfBirth: "",
  age: "",
  nationality: "",
  govtId: "",
  admissionCategory: "",
  bloodGroup: "",
  medicalHistory: "",
  hostelBlock: "",
  previousResident: "",
  messPreference: "",

  fatherName: "",
  fatherOccupation: "",
  fatherMobile: "",
  fatherEmail: "",
  fatherCountry: "",

  motherName: "",
  motherOccupation: "",
  motherMobile: "",
  motherEmail: "",
  motherCountry: "",

  resIndiaHouseNo: "",
  resIndiaStreet: "",
  resIndiaCity: "",
  resIndiaState: "",
  resIndiaCountry: "",
  resIndiaPostalCode: "",

  resForeignHouseNo: "",
  resForeignStreet: "",
  resForeignCity: "",
  resForeignState: "",
  resForeignCountry: "",
  resForeignPostalCode: "",

  guardianName: "",
  guardianRelationship: "",
  guardianMobile: "",
  guardianEmail: "",
  guardianHouseNo: "",
  guardianStreet: "",
  guardianCity: "",
  guardianState: "",
  guardianCountry: "",
  guardianPostalCode: "",

  passportPhoto: "",
  studentSignature: "",
  parentGuardianSignature: "",
  declaration: [] as string[],
  transactionId: "",

  roomNumber: "",
};

const hostelBlocks = [
  { label: "Flora (Boys)", value: "Flora" },
  { label: "Lavendar (Girls)", value: "Lavendar" },
];

export {
  Departments,
  campusList,
  semesters,
  admissionCategories,
  bloodGroups,
  initialValues,
  hostelBlocks,
  courses,
};