import { Schema, model } from "mongoose";

const reAdmissionSchema = new Schema({
  studentDetails: {
    name: {
      type: String,
      required: true,
      uppercase: true,
      description: "Full name of the resident in capital letters",
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
    year: {
      type: String,
      required: true,
      description: "Year of study",
    },
    semester: {
      type: String,
      required: true,
      description: "Current semester",
    },
    mobile: {
      type: String,
      required: true,
      description: "Resident's mobile number",
    },
    email: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      description: "Resident's email address",
    },
  },
  parentDetails: {
    mobile: {
      type: [String],
      required: true,
      description: "Parent's mobile numbers",
    },
    email: {
      type: String,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      description: "Parent's email address",
    },
  },
  localGuardian: {
    name: {
      type: String,
      description: "Name of the local guardian (if any)",
    },
    mobile: {
      type: String,
      description: "Local guardian's mobile number",
    },
  },
  address: {
    type: String,
    required: true,
    description: "Resident's address in capital letters",
  },
  hostelDetails: {
    hostelBlock: {
      type: String,
      enum: ["Flora", "Lavender"],
      required: true,
      description: "Hostel block (Flora for boys, Lavender for girls)",
    },
    roomNumber: {
      type: String,
      required: true,
      description: "Allotted room number",
    },
    keyReceived: {
      type: Boolean,
      default: false,
      description: "Whether the resident received the room key",
    },
  },
  paymentDetails: {
    feesPaid: {
      type: Boolean,
      required: true,
      description: "Whether the hostel fees have been paid",
    },
    transactionReferenceNo: {
      type: String,
      description: "Fee transaction reference number",
    },
    transactionDate: {
      type: Date,
      description: "Date of fee payment",
    },
    amount: {
      type: Number,
      default: 85500,
      description: "Amount paid (in Rs.)",
    },
    anyDues: {
      type: Boolean,
      default: false,
      description: "Whether there are any outstanding dues",
    },
  },
  images: {
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
  declaration: {
    studentAgreed: {
      type: Boolean,
      required: true,
      description: "Student's agreement to hostel rules",
    },
    parentAgreed: {
      type: Boolean,
      required: true,
      description: "Parent/guardian's agreement to hostel rules",
    },
    submissionDate: {
      type: Date,
      required: true,
      description: "Date of re-admission form submission",
    },
  },
  admissionStatus: {
    type: String,
    enum: ["Pending", "Admitted", "Not Admitted"],
    default: "Pending",
    description: "Status of re-admission",
  },
  officeDetails: {
    reAdmissionApproved: {
      type: Boolean,
      description: "Whether re-admission is approved by office",
    },
    paymentVerified: {
      type: Boolean,
      description: "Whether payment of fees is verified",
    },
    roomAllotted: {
      type: Boolean,
      description: "Whether room may be allotted",
    },
    staffSignature: {
      type: String,
      description: "Signature or name of office staff",
    },
    managerSignature: {
      type: String,
      description: "Signature or name of manager",
    },
    residentialCounsellorSignature: {
      type: String,
      description: "Signature or name of residential counsellor",
    },
    deputyWardenSignature: {
      type: String,
      description: "Signature or name of deputy warden",
    },
    executiveWardenSignature: {
      type: String,
      description: "Signature or name of executive warden",
    },
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

reAdmissionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const ReAdmission = model("ReAdmission", reAdmissionSchema);

export default ReAdmission;
