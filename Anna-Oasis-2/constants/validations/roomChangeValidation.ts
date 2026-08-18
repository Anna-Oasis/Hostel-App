import * as Yup from "yup";

export const roomValidationSchema = Yup.object({
  academic_year: Yup.string().required("Academic Year is required"),
  fromRoomNo: Yup.number()
    .typeError("Enter a valid room number")
    .required("From Room is required"),
  toRoomNo: Yup.number()
    .typeError("Enter a valid room number")
    .required("To Room is required"),
  rollNo: Yup.string().required("Roll Number is required"),
  toHostel : Yup.string().required("To hostel is required")
});