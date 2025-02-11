import { Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import TestForm from "@/components/TestForm";
import AdmissionForm from "@/components/AdmissionForm";
import React from "react";
import { Link, useRouter } from "expo-router";


export default function Index() {
  const router = useRouter();
  return (
    <>
      <View className="flex m-4 gap-4">
        <Button onPress={()=>router.push("/student/login")}>
          <ButtonText>Student</ButtonText>
        </Button>
        <Button>
          <ButtonText>Admin</ButtonText>
        </Button>
      </View>
    </>
  );
}
