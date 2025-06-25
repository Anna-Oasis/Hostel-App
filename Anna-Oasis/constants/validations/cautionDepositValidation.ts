import * as Yup from "yup";
const initialValues = {
  accountHolderName: "",
  accountNumber: "",
  bankName: "",
  bankAddress: "",
  ifscCode: "",
};

const validationSchema = Yup.object().shape({
  accountHolderName: Yup.string().required("Account holder name is required"),
  accountNumber: Yup.string().required("Account number is required"),
  bankName: Yup.string().required("Bank name is required"),
  bankAddress: Yup.string().required("Bank address is required"),
  ifscCode: Yup.string().required("IFS code is required"),
});

const NOTE = `
The students should request their parents to send a consent email / letter that the hostel refund may be transferred to the student’s bank account.
Students should submit the photocopy of the passbook with photograph affixed in the passbook showing the account number etc.
The refund of Caution Deposit should be claimed within one year failing which the amount shall be forfeited.
`;

export { initialValues, validationSchema, NOTE };