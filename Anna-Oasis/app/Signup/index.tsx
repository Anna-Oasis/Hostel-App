import React from "react";
import { View } from "react-native";
import SignupForm from "@/components/signup";
import { handleSignup } from "@/utils/authUtils";
import useLoadingStore from "@/stores/loadingStore";
import { router } from "expo-router";

export default function Signup() {
  const setLoading = useLoadingStore((state) => state.setLoading);

  return (
    <View className="flex-1 justify-center items-center p-4 bg-gray-50">
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
