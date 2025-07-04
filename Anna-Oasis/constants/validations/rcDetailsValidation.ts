import * as Yup from 'yup';

const rcDetailsValidation = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  dept: Yup.string().required('Department is required'),
  registerNo: Yup.string().required('Register number is required'),
  dob: Yup.string()
    .required('Date of birth is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  mobile: Yup.string()
    .required('Mobile number is required')
    .matches(/^\+?\d{10,15}$/, 'Invalid phone number'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  guardianName: Yup.string().required('Guardian name is required'),
  residentialAddress: Yup.string().required('Address is required'),
  bloodGroup: Yup.string()
    .required('Blood group is required')
    .oneOf(
      ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      'Invalid blood group'
    ),
  medicalHistory: Yup.string().optional(),
  passportPhotoUrl: Yup.string().required('Passport photo is required'),
  rcSignatureUrl: Yup.string().required('Signature is required'),
});

export default rcDetailsValidation;
