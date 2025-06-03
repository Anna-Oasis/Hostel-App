import React from "react";
import { View, StyleSheet } from "react-native";
import SignupForm from "@/components/signup";
import { handleSignup } from "@/utils/authUtils";
import { router } from "expo-router";

export default function Signup() {
  return (
    <View style={styles.container}>
      <SignupForm
        onSubmit={(values) =>
          handleSignup(values, () => router.push("/Login"))
        }
      />
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