import { Schema, model } from "mongoose";

const admissionSchema = new Schema({
  studentDetails: {
    name: {
      type: String,
      required: true,
      description: "Full name of the student",
    },
    rollNo: {
      type: String,
      required: true,
      description: "Student's roll number",
    },
    course: {
      type: String,
      required: true,
      description: "Course of study (e.g., B.Tech, M.Sc)",
    },
    branch: {
      type: String,
      required: true,
      description: "Branch of study (e.g., Computer Science, Mechanical)",
    },
    semester: {
      type: String,
      description: "Current semester",
    },
    dateOfBirth: {
      type: Date,
      required: true,
      description: "Date of birth in ISO format",
    },
    age: {
      type: Number,
      description: "Age calculated from date of birth",
    },
    mobile: {
      type: String,
      required: true,
      description: "Student's mobile number (from application form)",
    },
    email: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      description: "Student's email address",
    },
    admissionCategory: {
      type: String,
      enum: ["NRI", "CIWGC", "FN", "LDC", "SIDS"],
      required: true,
      description: "Admission category",
    },
    bloodGroup: {
      type: String,
      required: true,
      description: "Student's blood group",
    },
    medicalHistory: {
      type: String,
      description: "Brief medical history if any",
    },
    previousResident: {
      type: Boolean,
      default: false,
      description: "Whether student was previously a hostel resident",
    },
  },
  parentDetails: {
    fatherName: {
      type: String,
      description: "Name of the father",
    },
    fatherContact: {
      local: {
        type: String,
        description: "Father's local contact number",
      },
      foreign: {
        type: String,
        description: "Father's foreign contact number (optional)",
      },
    },
    motherName: {
      type: String,
      description: "Name of the mother",
    },
    motherContact: {
      local: {
        type: String,
        description: "Mother's local contact number",
      },
      foreign: {
        type: String,
        description: "Mother's foreign contact number (optional)",
      },
    },
    landline: {
      type: String,
      description: "Parent or guardian's landline number",
    },
    email: {
      type: String,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      description: "Local guardian's email address",
    },
    occupation: {
      type: String,
      required: true,
      description: "Occupation of the parent or guardian",
    },
    residentialAddress: {
      type: String,
      required: true,
      description: "Residential address of the parent or guardian",
    },
    pin: {
      type: String,
      required: true,
      description: "PIN code of parent or guardian's address",
    },
  },
  localGuardian: {
    name: {
      type: String,
      description: "Name of the local guardian (if any)",
    },
    occupation: {
      type: String,
      description: "Occupation of the local guardian",
    },
    residentialAddress: {
      type: String,
      description: "Residential address of the local guardian",
    },
    pin: {
      type: String,
      description: "PIN code of local guardian's address",
    },
    mobile: {
      type: String,
      description: "Local guardian's mobile numbers",
    },
    landline: {
      type: String,
      description: "Local guardian's landline number",
    },
    email: {
      type: String,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      description: "Local guardian's email address",
    },
  },
  images: {
    passportPhoto: {
      type: String,
      required: true,
      description: "Base64 encoded string of passport size photo",
    },
    studentSignature: {
      type: String,
      required: true,
      description: "Base64 encoded string of student's signature",
    },
    parentGuardianSignature: {
      type: String,
      required: true,
      description: "Base64 encoded string of parent/guardian's signature",
    },
  },
  hostelBlock: {
    type: String,
    enum: ["Flora", "Lavender"],
    required: true,
    description: "Hostel block (Flora for boys, Lavender for girls)",
  },
  roomNumber: {
    type: String,
    description: "Assigned room number",
  },
  messPreference: {
    type: String,
    enum: ["Vegetarian", "Non Vegetarian"],
    required: true,
    description: "Preference of mess type",
  },
  declaration: {
    studentAgreed: {
      type: Boolean,
      required: true,
      description: "Student's agreement to rules",
    },
    parentAgreed: {
      type: Boolean,
      required: true,
      description: "Parent/guardian's agreement to rules",
    },
    submissionDate: {
      type: Date,
      required: true,
      description: "Date of application submission",
    },
  },
  admissionStatus: {
    type: String,
    enum: ["Pending", "Admitted", "Not Admitted"],
    default: "Pending",
    description: "Status of hostel admission",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    description: "Timestamp of document creation",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    description: "Timestamp of last update",
  },
});

admissionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Admission = model("Admission", admissionSchema);

export default Admission;
