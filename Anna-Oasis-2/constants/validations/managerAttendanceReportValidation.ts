import * as Yup from "yup";

const MAX_REPORT_DAYS = 45;
const millisecondsPerDay = 24 * 60 * 60 * 1000;

const getInclusiveDayCount = (fromDate: string, toDate: string) => {
  const from = new Date(`${fromDate}T00:00:00`);
  const to = new Date(`${toDate}T00:00:00`);

  return Math.floor((to.getTime() - from.getTime()) / millisecondsPerDay) + 1;
};

export const managerAttendanceReportInitialValues = {
  fromDate: "",
  toDate: "",
  admissionSessionId: "",
  hostelBlock: "",
};

export const managerAttendanceReportValidationSchema = Yup.object().shape({
  fromDate: Yup.string().required("From date is required"),
  toDate: Yup.string()
    .required("To date is required")
    .test(
      "is-after-from",
      "To date must be after or equal to from date",
      function (value) {
        const { fromDate } = this.parent;
        if (!value || !fromDate) return true;
        return new Date(value) >= new Date(fromDate);
      }
    )
    .test(
      "range-limit",
      `Date range must not exceed ${MAX_REPORT_DAYS} days`,
      function (value) {
        const { fromDate } = this.parent;
        if (!value || !fromDate) return true;
        return getInclusiveDayCount(fromDate, value) <= MAX_REPORT_DAYS;
      }
    ),
  admissionSessionId: Yup.string().required("Admission session is required"),
  hostelBlock: Yup.string().required("Hostel block is required"),
});

