import { Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import TestForm from "@/components/TestForm";
import React from "react";
import { Link, router } from "expo-router";

export default function Index() {
  return (
    <>
      <View className="flex m-4 gap-4">
        <Button onPress={() => router.push("/Login")}>
          <ButtonText>Student</ButtonText>
        </Button>
        <Button>
          <ButtonText>Admin</ButtonText>
        </Button>
      </View>
    </>
  );
}
