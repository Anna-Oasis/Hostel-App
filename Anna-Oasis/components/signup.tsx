import React from "react";
import { View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";

const Signup = () => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .matches(
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/,
        "Enter a valid email address"
      )
      .required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        // Handle signup logic here
        console.log(values);
      }}
    >
      {({ handleSubmit }) => (
        <View>
          <TextField placeholder="Name" value="name" label="Full-Name" />
          <TextField placeholder="Email" value="email" label = "E-mail"/>
          <TextField placeholder="Password" value="password" label = "New-Password" />
          <TextField placeholder="Confirm Password" value="confirmPassword" label = "Confirm-Password" />
          <Button onPress={() => handleSubmit()}>
            <ButtonText>Sign Up</ButtonText>
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default Signup;
