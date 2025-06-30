import * as Yup from "yup";

export const summerVacationValidation = (hostelItemsOptions: { label: string; value: string }[]) => {
  const requiredItemValues = hostelItemsOptions.map((item) => item.value);

  return Yup.object().shape({
    vacationDate: Yup.string().required("Date of vacate is required"),
    vacationTime: Yup.string().required("Time of vacate is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string().email("Enter a valid email").required("Parent's email is required"),
    hostelItems: Yup.array()
      .required("You must select all hostel items")
      .test(
        "all-items-selected",
        "You must select all hostel items",
        (value) =>
          Array.isArray(value) &&
          requiredItemValues.every((item) => value.includes(item))
      ),
    declaration: Yup.array().min(1).required(),
  });
};
