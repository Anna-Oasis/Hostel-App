import GrievanceForm from "@/components/GrievanceForm";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import React, { useEffect } from "react";
import ModalCallable from "@/components/ModalCallable";
import { getUserId } from "@/utils/authUtils";
export default function GrievancesPage() {
  const router = useRouter();
  const [showModal, setShowModal] = React.useState(false);
  const [userId, setUserId] = React.useState<Number | null>(null);
  const handleSubmit = (values: any, id : Number | null) => {
    console.log(`Grievance Form Submitted by User ID: ${id}`, values);
    setShowModal(true);
    setTimeout(() => {
      redirectToHome();
    }, 4000); 
  };
  const redirectToHome = () => {
    if (!showModal) {
      router.replace("/User/Student");
    }
  }
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getUserId();
      setUserId(id);
    };
    fetchUserId();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", }}>
      <GrievanceForm
        onSubmit={(values) => {
          handleSubmit(values, userId);
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