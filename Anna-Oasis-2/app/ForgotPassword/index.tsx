import React from "react";
import { View } from "react-native";
import SignupForm from "@/components/auth/SignupCard";
import { handleSignup } from "@/utils/authUtils";
import useLoadingStore from "@/stores/loadingStore";
import { router } from "expo-router";

export default function ForgotPassword() {
  const setLoading = useLoadingStore((state) => state.setLoading);

  return (
    <View className="flex-1 justify-center  p-4 bg-gray-50">
      //section1 import from components

      //section 2 import from components

      //section 3 import from components
    </View>
  );
}
