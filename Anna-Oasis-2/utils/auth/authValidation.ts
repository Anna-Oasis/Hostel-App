import * as Yup from "yup";

export const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/, "Enter a valid email address")
    .required("Email is required"),
});

export const otpValidationSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("Verification code is required"),
});

export const resetPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^~`])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
      "Enter a valid email address"
    )
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .matches(
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
        "Enter a valid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^~`])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });
