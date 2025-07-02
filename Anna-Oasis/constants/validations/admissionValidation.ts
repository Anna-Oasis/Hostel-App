import * as Yup from "yup";
const phoneRegex = /\+[1-9]\d{9,14}$/;
const pinRegex = /^[0-9\s\-]{3,10}$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const allowedBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const validationSchemas = [
  // Page 0: Admission Details + Payment
  Yup.object({
    hostelBlock: Yup.string().required("Required"),
    messPreference: Yup.string().required("Required"),
    previousResident: Yup.string().required("Required"),
  }),
  Yup.object({
    transactionPhotoUrl: Yup.string().required(
      "Transaction screenshot is required"
    ),
    transactionId: Yup.string().trim().required("Transaction ID is required"),
  }),
  // Page 1: Declaration
  Yup.object({
    declaration: Yup.array().of(Yup.string()).min(2, "Required"),
  }),
  // Page 2: Preview (no validation)
  Yup.object({}),
];

export default validationSchemas;
