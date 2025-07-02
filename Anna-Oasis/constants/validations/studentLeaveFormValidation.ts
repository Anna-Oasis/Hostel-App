import * as Yup from "yup";
const phoneRegex = /^\+[1-9]\d{5,14}$/;

const combineDateTime = (date: string, time: string) => {
  if (!date || !time) return null;
  return new Date(`${date}T${time}`);
};

export const studentLeaveFormValidation = Yup.object().shape({
  leave_type: Yup.string().required("Leave type is required"),
  from_date: Yup.string().required("From date is required"),
  to_date: Yup.string().required("To date is required"),
  reason: Yup.string().required("Reason is required"),
  address_of_stay: Yup.string().required("Address of stay is required"),
  mobile: Yup.string().matches(phoneRegex, "Include country code (e.g., +91...)").required("Required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
});
