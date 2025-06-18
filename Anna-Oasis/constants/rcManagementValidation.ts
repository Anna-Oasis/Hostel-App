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
  { id: "3", name: "Alex Leeeeeeeeeeeeeeeeeeeeeeeee eeeeeeeee", hostel: "FLORA", assignedFloors: [] as string[] },
];

const floors = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"];

const floorShort = (floor: string) => {
  if (floor === "Ground Floor") return "GF";
  if (floor === "First Floor") return "FF";
  if (floor === "Second Floor") return "SF";
  if (floor === "Third Floor") return "TF";
  return floor;
};


const { width, height } = Dimensions.get("window");

// Responsive spacing and font sizes
const spacing = {
  xs: width * 0.008,
  sm: width * 0.02,
  md: width * 0.04,
  lg: width * 0.06,
  xl: width * 0.08,
};

const fontSizes = {
  sm: width * 0.03,
  md: width * 0.04,
  lg: width * 0.05,
  xl: width * 0.06,
};

const plusButtonStyles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: width * 0.08,
    bottom: height * 0.06,
    backgroundColor: "#2563eb",
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: (width * 0.14) / 2,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

const floorModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: spacing.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: "600",
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  floorItem: {
    width: "100%",
    padding: spacing.md,
    borderRadius: spacing.sm,
    backgroundColor: "#f3f4f6",
    marginBottom: spacing.sm,
    alignItems: "center",
    flexDirection: "row",
  },
});

const floordisplayStyles = StyleSheet.create({
  badge: {
    backgroundColor: "#2563eb",
    borderRadius: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs, 
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    maxWidth: width * 0.18,
    maxHeight: fontSizes.lg * 1, 
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start", 
  },
  badgeText: {
    color: "#fff",
    fontSize: fontSizes.sm,
    textAlign: "center",
    flexWrap: "wrap",
    lineHeight: fontSizes.sm * 1.2,
  },
});

export {
  hostelOptions,
  initialValues,
  validationSchema,
  initialRcList,
  floors,
  plusButtonStyles,
  floorModalStyles,
  floordisplayStyles,
  spacing,
  fontSizes,
    floorShort,
};