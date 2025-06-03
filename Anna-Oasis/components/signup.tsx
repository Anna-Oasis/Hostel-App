import React from "react";
import { View } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router"; // Import useRouter

const Signup = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  const router = useRouter(); // Initialize router

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
      onSubmit={onSubmit}
    >
      {({ handleSubmit, values, errors, touched }) => (
        <View>
          <TextField
            placeholder="Name"
            value="name"
            error={touched.name && errors.name}
          />
          <TextField
            placeholder="Email"
            value="email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={touched.email && errors.email}
          />
          <TextField
            placeholder="Password"
            value="password"
            secureTextEntry
            error={touched.password && errors.password}
          />
          <TextField
            placeholder="Confirm Password"
            value="confirmPassword"
            secureTextEntry
            error={touched.confirmPassword && errors.confirmPassword}
          />
          <Button onPress={() => handleSubmit()}>
            <ButtonText>Sign Up</ButtonText>
          </Button>
          <Button onPress={() => router.push("/Login")}> {/* Navigate to Login */}
            <ButtonText>Go to Login</ButtonText>
          </Button>
        </View>
      )}
    </Formik>
  );
};

export default Signup;
