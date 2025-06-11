import LeaveForm from "@/components/LeaveForm";
import { View, Text } from "react-native";
import React from "react";
import ModalCallable from "@/components/ModalCallable";
import { useRouter } from "expo-router";

export default function LeaveFormPage() {
  const [showModal, setShowModal] = React.useState(false);
  const router = useRouter();
  const handleSubmit = (values: any) => {
    console.log("Leave submitted:", values);
    setShowModal(true);
    if (!showModal) {
      router.push("/User/Student");
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <LeaveForm onSubmit={(values) => {
        console.log("Leave Form Submitted:", values);
        handleSubmit(values);
      }}
      />
      <ModalCallable
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Leave Application Submitted"
        message="Your leave application has been successfully submitted. We will review it and get back to you shortly."
      />
    </View>
  );
}