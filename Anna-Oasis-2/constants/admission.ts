const admissionCategories = [
  { label: "NRI", value: "NRI" },
  { label: "CIWGC", value: "CIWGC" },
  { label: "FN(LDC/SIDS)", value: "FN(LDC/SIDS)" },
  { label: "ICCR", value: "ICCR" },
  { label : "OTHERS", value : "OTHERS"}
];

const initialValues = {
  previousResident: undefined,
  messPreference: undefined,
  studentAgreed: "",
  parentAgreed: "",
  submissionDate: "",
  transactionId: "",
  academicYear: "",
  hostelBlock: undefined,
  transactionPhotoUrl: "",
  declaration: [] as string[]
};

const hostelBlocks = [
  { label: "Flora (Boys)", value: "Flora" },
  { label: "Lavender (Girls)", value: "Lavender" },
  { label : "Tulip", value : "Tulip"}
];

const hostelBlockValues = hostelBlocks.map((block) => block.value);


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
  hostelBlockValues,
  messPreferences,
  previousResidentOptions,
};
