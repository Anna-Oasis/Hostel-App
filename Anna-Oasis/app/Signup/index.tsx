import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import SignupForm from "@/components/signup";

export default function Signup() {
  const handleSignup = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      Alert.alert("Signup Successful", "You can now log in.");
      router.push("/Login");
    } catch (error: any) {
      Alert.alert("Signup Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <SignupForm onSubmit={handleSignup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5FCFF",
  },
});