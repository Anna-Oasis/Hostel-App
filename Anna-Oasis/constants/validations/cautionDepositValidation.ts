import * as Yup from "yup";
const initialValues = {
  accountHolderName: "",
  accountNumber: "",
  bankName: "",
  addressOfTheBank: "",
  IFSCode: "",
};

const validationSchema = Yup.object().shape({
  accountHolderName: Yup.string().required("Account holder name is required"),
  accountNumber: Yup.string().required("Account number is required"),
  bankName: Yup.string().required("Bank name is required"),
  addressOfTheBank: Yup.string().required("Bank address is required"),
  IFSCode: Yup.string().required("IFS code is required"),
});

const NOTE = `
• Please ensure that the bank account details provided are accurate and belong to the student.
• The caution deposit will be refunded to this account after the completion of the course, subject to any deductions as per hostel policies.
• If incorrect or invalid bank account details are provided, the refund will not be processed.
`;

export { initialValues, validationSchema, NOTE };
