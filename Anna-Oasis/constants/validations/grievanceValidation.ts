import * as Yup from "yup";

export const grievanceValidationSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  description: Yup.string().required("Description is required"),
  grievance_type: Yup.string().required("Category is required"),
});
