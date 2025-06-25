import * as Yup from "yup";

const combineDateTime = (date: string, time: string) => {
  if (!date || !time) return null;
  return new Date(`${date}T${time}`);
};

export const studentLeaveFormValidation = Yup.object().shape({
  leave_type: Yup.string().required("Leave type is required"),
  from_date: Yup.string().required("From date is required"),
  from_time: Yup.string().required("From time is required"),
  to_date: Yup.string().required("To date is required"),
  to_time: Yup.string()
    .required("To time is required")
    .test(
      "from-before-to",
      "From date and time must be before To date and time",
      function (to_time) {
        const { from_date, from_time, to_date } = this.parent;
        if (!from_date || !from_time || !to_date || !to_time) return true;
        const from = combineDateTime(from_date, from_time);
        const to = combineDateTime(to_date, to_time);
        if (!from || !to) return true;
        return from < to;
      }
    ),
  reason: Yup.string().required("Reason is required"),
  destination: Yup.string().required("Destination is required"),
  emergency_contact: Yup.string().required("Emergency contact is required"),
});
