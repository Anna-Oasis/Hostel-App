import * as Yup from "yup";

export const rcLeaveValidationSchema = Yup.object({
  arrival: Yup.string().required("Arrival date is required"),
  leaving: Yup.string().required("Leaving date is required"),
  reason: Yup.string().required("Reason is required"),
  alternate: Yup.string().required("Alternate RC is required"),
});
