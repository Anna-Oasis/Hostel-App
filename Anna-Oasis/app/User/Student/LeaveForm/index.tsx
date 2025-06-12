import LeaveForm from "@/components/LeaveForm";
import { View, Text } from "react-native";
import React, { useEffect } from "react";
import ModalCallable from "@/components/ModalCallable";
import { useRouter } from "expo-router";
import { getUserId } from "@/utils/authUtils";

export default function LeaveFormPage() {
  const [showModal, setShowModal] = React.useState(false);
  const [userId, setUserId] = React.useState<Number | null>(null);
  const router = useRouter();
  const handleSubmit = (values: any, id : Number | null) => {
    console.log(`Leave Form Submitted by User ID: ${id}`, values);
    setShowModal(true);
    if (!showModal) {
      router.push("/User/Student");
    }
  };
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <LeaveForm onSubmit={(values) => {
        console.log("Leave Form Submitted:", values);
        handleSubmit(values, userId);
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