import * as Yup from "yup";
import { hostelBlockValues } from "../admission";

const deputyWardenValidation = Yup.object().shape({
  name: Yup.string()
    .required("Name is required"),

  dept: Yup.string()
    .required("Department is required"),

  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  block: Yup.string()
    .required("Block is required")
    .oneOf(hostelBlockValues, "Invalid hostel block"),

  passportPhotoUrl: Yup.string()
    .required("Passport photo is required"),
});

export default deputyWardenValidation;