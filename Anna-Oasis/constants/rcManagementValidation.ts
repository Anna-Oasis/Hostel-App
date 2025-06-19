import * as Yup from "yup";
import { StyleSheet, Dimensions } from "react-native";

const hostelOptions = [
  { label: "FLORA", value: "FLORA" },
  { label: "LAVENDER", value: "LAVENDER" },
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

const initialRcList = [
  { id: "1", name: "John Doe", hostel: "LAVENDER", assignedFloors: [] as string[] },
  { id: "2", name: "Jane Smith", hostel: "FLORA", assignedFloors: [] as string[] },
  { id: "3", name: "Alex Lee", hostel: "FLORA", assignedFloors: [] as string[] },
  { id: "4", name: "Emily Carter", hostel: "LAVENDER", assignedFloors: [] as string[] },
  { id: "5", name: "Michael Brown", hostel: "FLORA", assignedFloors: [] as string[] },
  { id: "6", name: "Sarah Wilsonwwwwwwwwwwww", hostel: "LAVENDER", assignedFloors: [] as string[] },
  { id: "7", name: "David Kim", hostel: "FLORA", assignedFloors: [] as string[] },
  { id: "8", name: "Olivia Chen", hostel: "LAVENDER", assignedFloors: [] as string[] },
  { id: "9", name: "Chris Evans", hostel: "FLORA", assignedFloors: [] as string[] },
  { id: "10", name: "Sophia Patel", hostel: "LAVENDER", assignedFloors: [] as string[] },
  { id: "11", name: "Daniel Lee", hostel: "FLORA", assignedFloors: [] as string[] },
];

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
  initialRcList,
  floors,
    floorShort,
};