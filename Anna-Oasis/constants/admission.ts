
const admissionCategories = [
  { label: "NRI", value: "NRI" },
  { label: "CIWGC", value: "CIWGC" },
  { label: "FN", value: "FN" },
  { label: "LDC", value: "LDC" },
  { label: "SIDS", value: "SIDS" },
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
  hostelBlocks,
};
