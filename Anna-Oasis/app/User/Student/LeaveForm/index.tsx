import LeaveForm from "@/components/LeaveForm";
import { View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import ModalCallable from "@/components/ModalCallable";
import { useRouter } from "expo-router";
import { useUserStore } from "@/stores/userStore"
import { getToken } from "@/utils/authUtils";
import { verifyToken } from "@/utils/authUtils"; 

function LeaveFormPage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const hasInitialized = useRef(false);

  const handleSubmit = (values: any, id: number | null) => {
    console.log(`Leave Form Submitted by User ID: ${id}`, values);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push("/User/Student");
  };

  useEffect(() => {
    if (hasInitialized.current || user !== null) return;

    hasInitialized.current = true;

    const initializeUser = async () => {
      try {
        const token = await getToken();
        if (!token) {
          router.replace("/Login");
          return;
        }

        const verifiedUser = await verifyToken(token);
        if (verifiedUser) {
          setUser(verifiedUser);
        }
      } catch (error) {
        console.error("Failed to verify user:", error);
      }
    };

    initializeUser();
  }, [user, setUser]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <LeaveForm
        onSubmit={(values) => {
          handleSubmit(values, user ? parseInt(user.id) : null);
        }}
      />
      <ModalCallable
        show={showModal}
        onClose={handleModalClose}
        title="Leave Application Submitted"
        message="Your leave application has been successfully submitted. We will review it and get back to you shortly."
      />
    </View>
  );
}

export default LeaveFormPage;
