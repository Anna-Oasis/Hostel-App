import React from "react";
import { View } from "react-native";
import SignupForm from "@/components/auth/SignupCard";
import { handleSignup } from "@/utils/authUtils";
import useLoadingStore from "@/stores/loadingStore";
import { router } from "expo-router";
import Footer from "@/components/appbars/Footer";

export default function Signup() {
  const setLoading = useLoadingStore((state) => state.setLoading);

  return (
    <View className="flex-1 justify-center  p-4 bg-gray-50">
      <SignupForm
        onSubmit={(values) => {
          setLoading(true);
          console.log("Signup values:", values);
          handleSignup(values, () => router.push("/Login"));
          setLoading(false);
        }}
      />
    </View>
  );
}
