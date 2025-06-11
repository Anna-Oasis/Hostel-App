import GrievanceForm from "@/components/GrievanceForm";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import React from "react";
import ModalCallable from "@/components/ModalCallable";
export default function GrievancesPage() {
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);
  const handleSubmit = (values : any) => {
    console.log("Grievance submitted:", values);
    setShowModal(true);
    if (!showModal) {
      router.push("/User/Student");
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", }}>
      <GrievanceForm
        onSubmit={(values) => {
            handleSubmit(values);
          }
        } 
      />
      <ModalCallable 
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Grievance Submitted"
        message="Your grievance has been successfully submitted. We will review it and get back to you shortly."
      />
    </View>
  );
}