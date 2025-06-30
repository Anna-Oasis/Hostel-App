import * as Yup from "yup";

export const validationSchema = Yup.object({
  vacateDate: Yup.string().required('Date is required'),
  vacateTime: Yup.string().required('Time is required'),
  futureAddress: Yup.string().required('Address is required'),
  itemsReturned: Yup.array().min(1, 'Select at least one item'),
  declarationAccepted: Yup.array()
    .of(Yup.string().oneOf(['true']))
    .min(1, 'You must accept the declaration')
});

