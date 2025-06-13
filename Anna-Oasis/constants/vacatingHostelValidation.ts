import * as Yup from "yup";

export const validationSchema = Yup.object({
  roomNo: Yup.string()
    .matches(/^\d+$/, 'Room number must be numeric')
    .required('Room number is required'),
  vacateDate: Yup.string().required('Date is required'),
  vacateTime: Yup.string().required('Time is required'),
  futureAddress: Yup.string().required('Address is required'),
  studentMobile: Yup.string().required('Mobile number is required'),
  parentEmail: Yup.string().email('Invalid email').required('Parent email is required'),
  localGuardianMobile: Yup.string().required('Guardian number is required'),
  itemsReturned: Yup.array().min(1, 'Select at least one item'),
  declarationAccepted: Yup.array()
    .of(Yup.string().oneOf(['true']))
    .min(1, 'You must accept the declaration')
});

