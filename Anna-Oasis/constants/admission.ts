const admissionCategories = [
  { label: "NRI", value: "NRI" },
  { label: "CIWGC", value: "CIWGC" },
  { label: "FN", value: "FN" },
  { label: "LDC", value: "LDC" },
  { label: "SIDS", value: "SIDS" },
];

const initialValues = {
  admissionCategory: undefined,
  previousResident: undefined,
  messPreference: undefined,
  studentAgreed: "",
  parentAgreed: "",
  submissionDate: "",
  transactionId: "",
  academicYear: "",
  hostelBlock: undefined,
  declaration: [] as string[]
};

const hostelBlocks = [
  { label: "Flora (Boys)", value: "Flora" },
  { label: "Lavendar (Girls)", value: "Lavendar" },
];

const messPreferences = [
  { label: "Veg", value: "Veg" },
  { label: "Non-Veg", value: "Non-Veg" },
];

const previousResidentOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export {
  admissionCategories,
  initialValues,
  hostelBlocks,
  messPreferences,
  previousResidentOptions,
};
