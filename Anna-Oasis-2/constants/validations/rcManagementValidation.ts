import * as Yup from "yup";
import { StyleSheet, Dimensions } from "react-native";

const hostelOptions = [
  { label: "Flora", value: "Flora" },
  { label: "Lavender", value: "Lavender" },
];

const initialValues = {
  name: "",
  email: "",
  password: "",
  hostel: "",
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  hostel: Yup.string().required("Hostel is required"),
});


const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"];

const floorShort = (floor: string) => {
  if (floor === "Ground Floor") return "GF";
  if (floor === "First Floor") return "FF";
  if (floor === "Second Floor") return "SF";
  if (floor === "Third Floor") return "TF";
  return floor;
};


export {
  hostelOptions,
  initialValues,
  validationSchema,
  floors,
    floorShort,
};