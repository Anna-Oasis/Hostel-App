import * as Yup from "yup";
import { vacatingItems } from "../vacatingHostels";

export const validationSchema = Yup.object({
  vacating_date: Yup.date()
    .typeError('Vacating date must be a valid date')
    .required('Vacating date is required'),
  vacating_time: Yup.string()
    .required('Vacating time is required'),
  future_address: Yup.string().required('Future address is required'),
  returned_items: Yup.array()
    .of(Yup.string())
    .test(
      "all-items-returned",
      "All items must be returned",
      (value) => Array.isArray(value) && vacatingItems.every(item => value.includes(item))
    ),
  endeavour: Yup.string().required('Endeavour is required'),
  endeavourDescription: Yup.string().required('Endeavour description is required'),
  feedback: Yup.string().required('Feedback is required'),
});

