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

const pgBranches = {
  "M.E.": [
    {
      label: "M.E. Structural Engineering",
      value: "M.E. Structural Engineering",
    },
    {
      label: "M.E. Construction Engg and Management",
      value: "M.E. Construction Engg and Management",
    },
    {
      label: "M.E. Irrigation Water Management",
      value: "M.E. Irrigation Water Management",
    },
    {
      label: "M.E. Hydrology and Water Resources Engg",
      value: "M.E. Hydrology and Water Resources Engg",
    },
    {
      label: "M.E. Environmental Engineering",
      value: "M.E. Environmental Engineering",
    },
    {
      label: "M.E. Transportation Engineering",
      value: "M.E. Transportation Engineering",
    },
    {
      label: "M.E. Soil Mechanics and Foundation Engg",
      value: "M.E. Soil Mechanics and Foundation Engg",
    },
    {
      label: "M.E. Environmental Management",
      value: "M.E. Environmental Management",
    },
    {
      label: "M.E. Remote Sensing and Geomatics",
      value: "M.E. Remote Sensing and Geomatics",
    },
    {
      label: "M.E. Internal Combustion Engg",
      value: "M.E. Internal Combustion Engg",
    },
    { label: "M.E. Energy Engineering", value: "M.E. Energy Engineering" },
    {
      label: "M.E. Computer Integrated Manufacturing",
      value: "M.E. Computer Integrated Manufacturing",
    },
    {
      label:
        "M.E. Thermal Engg (with specialization in Refrigeration and Air Conditioning)",
      value:
        "M.E. Thermal Engg (with specialization in Refrigeration and Air Conditioning)",
    },
    { label: "M.E. Engineering Design", value: "M.E. Engineering Design" },
    {
      label: "M.E. Aeronautical Engineering",
      value: "M.E. Aeronautical Engineering",
    },
    {
      label: "M.E. Automobile Engineering",
      value: "M.E. Automobile Engineering",
    },
    {
      label: "M.E. Industrial Engineering",
      value: "M.E. Industrial Engineering",
    },
    {
      label: "M.E. Manufacturing Engineering",
      value: "M.E. Manufacturing Engineering",
    },
    { label: "M.E. Mechatronics", value: "M.E. Mechatronics" },
    {
      label: "M.E. Manufacturing Systems and Management",
      value: "M.E. Manufacturing Systems and Management",
    },
    {
      label: "M.E. Quality Engineering and Management",
      value: "M.E. Quality Engineering and Management",
    },
    {
      label: "M.E. Printing and Packaging Technology",
      value: "M.E. Printing and Packaging Technology",
    },
    { label: "M.E. Aerospace Technology", value: "M.E. Aerospace Technology" },
    { label: "M.E. Solar Energy", value: "M.E. Solar Energy" },
    {
      label: "M.E. Product Design and Development",
      value: "M.E. Product Design and Development",
    },
    { label: "M.E. Mobility Engineering", value: "M.E. Mobility Engineering" },
    {
      label: "M.E. Power Systems Engineering",
      value: "M.E. Power Systems Engineering",
    },
    {
      label: "M.E. Power Electronics and Drives",
      value: "M.E. Power Electronics and Drives",
    },
    {
      label: "M.E. Embedded System Technologies",
      value: "M.E. Embedded System Technologies",
    },
    {
      label: "M.E. High Voltage Engineering",
      value: "M.E. High Voltage Engineering",
    },
    {
      label: "M.E. Control and Instrumentation Engg",
      value: "M.E. Control and Instrumentation Engg",
    },
    {
      label:
        "M.E. Instrumentation Engineering (Specialization in Industrial Automation)",
      value:
        "M.E. Instrumentation Engineering (Specialization in Industrial Automation)",
    },
    {
      label: "M.E. Power Engineering and Management",
      value: "M.E. Power Engineering and Management",
    },
    {
      label: "M.E. Computer Science and Engg",
      value: "M.E. Computer Science and Engg",
    },
    { label: "M.E. Software Engineering", value: "M.E. Software Engineering" },
    {
      label:
        "M.E. Computer Science and Engineering (Specialization in Operations Research)",
      value:
        "M.E. Computer Science and Engineering (Specialization in Operations Research)",
    },
    {
      label:
        "M.E. Computer Science and Engg (Specialization in Big Data Analytics)",
      value:
        "M.E. Computer Science and Engg (Specialization in Big Data Analytics)",
    },
    {
      label: "M.E. Communication Systems",
      value: "M.E. Communication Systems",
    },
    { label: "M.E. VLSI Design", value: "M.E. VLSI Design" },
    { label: "M.E. Medical Electronics", value: "M.E. Medical Electronics" },
    {
      label: "M.E. Bio Medical Engineering",
      value: "M.E. Bio Medical Engineering",
    },
    {
      label: "M.E. Communication and Networking",
      value: "M.E. Communication and Networking",
    },
    { label: "M.E. Avionics", value: "M.E. Avionics" },
    { label: "M.E. Applied Electronics", value: "M.E. Applied Electronics" },
    {
      label: "M.E. Wireless Technologies",
      value: "M.E. Wireless Technologies",
    },
    {
      label: "M.E. VLSI Design and Embedded Systems",
      value: "M.E. VLSI Design and Embedded Systems",
    },
  ],
  "M.Tech": [
    { label: "M.Tech. Ocean Technology", value: "M.Tech. Ocean Technology" },
    {
      label:
        "M.Tech. Information Technology (Specialization in Artificial Intelligence and Data Science)",
      value:
        "M.Tech. Information Technology (Specialization in Artificial Intelligence and Data Science)",
    },
    {
      label: "M.Tech. Information Technology",
      value: "M.Tech. Information Technology",
    },
    {
      label: "M.Tech. Laser and Electro Optical Engg",
      value: "M.Tech. Laser and Electro Optical Engg",
    },
    {
      label: "M.Tech. Chemical Engineering",
      value: "M.Tech. Chemical Engineering",
    },
    {
      label: "M.Tech. Textile Technology",
      value: "M.Tech. Textile Technology",
    },
    {
      label: "M.Tech. Ceramic Technology",
      value: "M.Tech. Ceramic Technology",
    },
    {
      label: "M.Tech. Petroleum Refining and Petro-Chemicals",
      value: "M.Tech. Petroleum Refining and Petro-Chemicals",
    },
    {
      label: "M.Tech. Polymer Science and Engg",
      value: "M.Tech. Polymer Science and Engg",
    },
    {
      label: "M.Tech. Environmental Science and Technology",
      value: "M.Tech. Environmental Science and Technology",
    },
    { label: "M.Tech. Biotechnology", value: "M.Tech. Biotechnology" },
    {
      label: "M.Tech. Bio Pharmaceutical Technology",
      value: "M.Tech. Bio Pharmaceutical Technology",
    },
    { label: "M.Tech. Rubber Technology", value: "M.Tech. Rubber Technology" },
    {
      label: "M.Tech. Leather Technology",
      value: "M.Tech. Leather Technology",
    },
    {
      label: "M.Tech. Footwear Engineering and Management",
      value: "M.Tech. Footwear Engineering and Management",
    },
    {
      label: "M.Tech. Nano Science and Technology",
      value: "M.Tech. Nano Science and Technology",
    },
    { label: "M.Tech. Food Technology", value: "M.Tech. Food Technology" },
    {
      label: "M.Tech. Industrial Safety and Hazards & Management",
      value: "M.Tech. Industrial Safety and Hazards & Management",
    },
    {
      label: "M.Tech. Computational Biology",
      value: "M.Tech. Computational Biology",
    },
  ],
  "M.Arch": [
    { label: "M.Arch.", value: "M.Arch." },
    {
      label: "M.Arch. Landscape Architecture",
      value: "M.Arch. Landscape Architecture",
    },
    { label: "M.Plan.", value: "M.Plan." },
  ],
  "M.Sc.": [
    {
      label: "M.Sc. Mathematics (2 years)",
      value: "M.Sc. Mathematics (2 years)",
    },
    {
      label: "M.Sc. Medical Physics (2 years)",
      value: "M.Sc. Medical Physics (2 years)",
    },
    {
      label: "M.Sc. Applied Chemistry (2 years)",
      value: "M.Sc. Applied Chemistry (2 years)",
    },
    {
      label: "M.Sc. Applied Geology (2 years)",
      value: "M.Sc. Applied Geology (2 years)",
    },
    {
      label: "M.Sc. Materials Science (2 years)",
      value: "M.Sc. Materials Science (2 years)",
    },
    {
      label: "M.Sc. Electronic Media (2 years)",
      value: "M.Sc. Electronic Media (2 years)",
    },
    {
      label:
        "M.Sc. Multimedia (specialization in VISUAL COMMUNICATION) (2 years)",
      value:
        "M.Sc. Multimedia (specialization in VISUAL COMMUNICATION) (2 years)",
    },
    {
      label: "M.Sc. Computer Science (5 years)",
      value: "M.Sc. Computer Science (5 years)",
    },
    {
      label: "M.Sc. Information Technology (5 years)",
      value: "M.Sc. Information Technology (5 years)",
    },
    {
      label: "M.Sc. Electronic Media (5 years)",
      value: "M.Sc. Electronic Media (5 years)",
    },
  ],
  MBA: [
    {
      label: "Master of Business Administration (MBA)",
      value: "Master of Business Administration (MBA)",
    },
    { label: "M.B.A. Tourism Management", value: "M.B.A. Tourism Management" },
  ],
  MCA: [
    {
      label: "Master of Computer Applications (M.C.A.)",
      value: "Master of Computer Applications (M.C.A.)",
    },
  ],
};

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
  { label: "M.E.", value: "M.E." },
  { label: "M.Tech", value: "M.Tech" },
  { label: "M.Arch", value: "M.Arch" },
  { label: "M.Sc.", value: "M.Sc." },
  { label: "MBA", value: "MBA" },
  { label: "MCA", value: "MCA" },
];

const ugCourses = [
  { label: "B.E.", value: "B.E." },
  { label: "B.Tech", value: "B.Tech" },
  { label: "B.Arch", value: "B.Arch" },
];

const pgCourses = [
  { label: "M.E.", value: "M.E." },
  { label: "M.Tech", value: "M.Tech" },
  { label: "M.Arch", value: "M.Arch" },
  { label: "M.Sc.", value: "M.Sc." },
  { label: "MBA", value: "MBA" },
  { label: "MCA", value: "MCA" },
];

const ugBranches = {
  "B.E.": Departments,
  "B.Tech": Departments,
  "B.Arch": [{ label: "Architecture", value: "Architecture" }],
};

const semesters = [
  { label: "Semester 1", value: "1" },
  { label: "Semester 2", value: "2" },
  { label: "Semester 3", value: "3" },
  { label: "Semester 4", value: "4" },
  { label: "Semester 5", value: "5" },
  { label: "Semester 6", value: "6" },
  { label: "Semester 7", value: "7" },
  { label: "Semester 8", value: "8" },
  { label: "Semester 9", value: "9" },
  { label: "Semester 10", value: "10" },
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
  { label: "A1+", value: "A1+" },
  { label: "A1-", value: "A1-" },
  { label: "A2+", value: "A2+" },
  { label: "A2-", value: "A2-" },
  { label: "A1B+", value: "A1B+" },
  { label: "A1B-", value: "A1B-" },
  { label: "A2B+", value: "A2B+" },
  { label: "A2B-", value: "A2B-" },
  { label: "Bombay Blood Group", value: "Bombay" },
];

const govtIdTypes = [
  { label: "Aadhaar", value: "aadhaar" },
  { label: "Voter ID", value: "voterId" },
  { label: "PAN Card", value: "panCard" },
];

const initialValues = {
  name: "",
  rollNo: "",
  courseType: "", // UG or PG
  course: "",
  branch: "",
  semester: "",
  mobile: "",
  email: "",
  emergencyContact: "",
  dateOfBirth: "",
  nationality: "",
  bloodGroup: "",
  medicalHistory: "",
  gender: "",
  admissionCategory: "",
  admissionCategoryReason: "",

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
  resIndiaCountry: "India",
  resIndiaPostalCode: "",

  resForeignHouseNo: "",
  resForeignStreet: "",
  resForeignCity: "",
  resForeignState: "",
  resForeignCountry: "",
  resForeignPostalCode: "",

  localGuardianName: "",
  localGuardianRelationship: "",
  localGuardianMobile: "",
  localGuardianEmail: "",
  guardianHouseNo: "",
  guardianStreet: "",
  guardianCity: "",
  guardianState: "",
  guardianCountry: "India",
  guardianPostalCode: "",

  passportPhotoUrl: "",
  studentSignatureUrl: "",
  parentGuardianSignatureUrl: "",
  govtIdType: "",
  govtId: "",
  categoryProofUrl: "",
  admissionSlipUrl: "",
  declaration: [] as string[],
  transactionId: "",

  roomNumber: "",
};

const leaveTypes = [
  { label: "Medical Leave", value: "medical" },
  { label: "Emergency Leave", value: "emergency" },
  {
    label: "Special Vacation Leave [i.e, Diwali, Pongal]",
    value: "specialVacation",
  },
  { label: "Personal Leave", value: "personal" },
  { label: "Other", value: "other" },
];

export {
  Departments,
  campusList,
  semesters,
  bloodGroups,
  leaveTypes,
  initialValues,
  courses,
  ugCourses,
  pgCourses,
  ugBranches,
  govtIdTypes,
  pgBranches,
};
