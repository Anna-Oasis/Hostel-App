import React from "react";
import { View } from "react-native";
import SignupForm from "@/components/signup";
import { handleSignup } from "@/utils/authUtils";
import { router } from "expo-router";

export default function Signup() {
  return (
    <View className="flex-1 justify-center items-center p-4 bg-gray-50">
      <SignupForm
        onSubmit={(values) =>
          handleSignup(values, () => router.push("/Login"))
        }
      />
    </View>
  );
}