import * as Yup from "yup";
import { badgeStatus } from "@/components/ApprovalCard";

const initialValues = {
  refundAmount: "",
  deductionAmount: "",
  deductionReason: "",
};
const validationSchema = Yup.object().shape({
  refundAmount: Yup.number().required("Refund amount is required"),
  deductionAmount: Yup.number().required("Deduction amount is required"),
  deductionReason: Yup.string().required("Reason for deduction is required"),
});

// NOTE: This is a placeholder for the refund approval modal initial values and validation schema.
// The actual implementation may vary based on the application's requirements.
const dummyApplications = [
  {
    id: "1",
    rollNumber: "22CS1001",
    name: "Aarav Kumar",
    status: badgeStatus.Pending,
    details: {
      "Account Holder Name": "Aarav Kumar",
      "Account Number": "1234567890",
      "Bank Name": "State Bank of India",
      "Bank Address": "SBI Main Branch, Chennai",
      "IFS Code": "SBIN0001234",
      "Note": "Consent letter sent by parent. Passbook copy attached.",
    },
  },
  {
    id: "2",
    rollNumber: "22EC1022",
    name: "Priya Sharma",
    status: badgeStatus.Pending,
    details: {
      "Account Holder Name": "Priya Sharma",
      "Account Number": "9876543210",
      "Bank Name": "ICICI Bank",
      "Bank Address": "ICICI Anna Nagar, Chennai",
      "IFS Code": "ICIC0005678",
      "Note": "Consent letter and passbook copy attached.",
    },
  },
  {
    id: "3",
    rollNumber: "22ME1055",
    name: "Rahul Singh",
    status: badgeStatus.Rejected,
    details: {
      "Account Holder Name": "Rahul Singh",
      "Account Number": "1122334455",
      "Bank Name": "HDFC Bank",
      "Bank Address": "HDFC T Nagar, Chennai",
      "IFS Code": "HDFC0007890",
      "Note": "Missing consent letter.",
    },
  },
];

export { initialValues as RefundApprovalInitialValues, validationSchema as RefundApprovalValidationSchema , dummyApplications };