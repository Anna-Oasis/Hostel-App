import * as Yup from "yup";

export const summerVacationValidation = (hostelItemsOptions: { label: string; value: string }[]) => {
  const requiredItemValues = hostelItemsOptions.map((item) => item.value);

  return Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Parent's email is required"),
    mobile: Yup.string()
      .min(10, "Mobile number too short")
      .max(15, "Mobile number too long")
      .required("Mobile number is required"),
    vacation_from: Yup.string()
      .required("Date of vacate is required")
      .test(
        "is-date",
        "Invalid ISO timestamp for vacation_from",
        (val) => !!val && !isNaN(Date.parse(val))
      ),
    address_of_stay: Yup.string()
      .min(3, "Address is too short")
      .max(100, "Address too long")
      .required("Address is required"),
    returned_items: Yup.array()
      .of(Yup.string().max(100))
      .test(
        "all-items-selected",
        "You must select all hostel items",
        (value) =>
          Array.isArray(value) &&
          requiredItemValues.every((item) => value.includes(item))
      )
      .required("You must handover all the hostel items to resident counsellor"),
  });
};
