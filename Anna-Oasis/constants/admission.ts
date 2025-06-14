
const admissionCategories = [
  { label: "NRI", value: "NRI" },
  { label: "CIWGC", value: "CIWGC" },
  { label: "FN", value: "FN" },
  { label: "LDC", value: "LDC" },
  { label: "SIDS", value: "SIDS" },
];

const grievanceCategories = [
  { label: "Administrative", value: "Administrative" },
  { label: "Hostel", value: "Hostel" },
  { label: "Mess", value: "Mess" },
  { label: "Health", value: "Health" },
  { label: "Other", value: "Other" },
];

const initialValues = {
  admissionCategory: "",
  previousResident: "",
  messPreference: "",
  studentAgreed: "",
  parentAgreed: "",
  submissionDate: "",
  transactionId: "",
  academicYear: "",
  hostelBlock: ""
};

const hostelBlocks = [
  { label: "Flora (Boys)", value: "Flora" },
  { label: "Lavendar (Girls)", value: "Lavendar" },
];

export {
  admissionCategories,
  initialValues,
  grievanceCategories,
  hostelBlocks,
};
