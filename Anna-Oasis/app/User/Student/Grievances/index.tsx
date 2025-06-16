import GrievanceForm from "@/components/GrievanceForm";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import React, { useEffect } from "react";
import ModalCallable from "@/components/ModalCallable";
import { useUserStore } from "@/stores/userStore";
import { getToken, verifyToken } from "@/utils/authUtils";
import { useState, useRef } from "react";

export default function GrievancesPage() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const hasInitialized = useRef(false);
  const handleSubmit = (values: any, id: Number | null) => {
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
    <View style={{ flex: 1, justifyContent: "center", }}>
      <GrievanceForm
        onSubmit={(values) => {
          handleSubmit(values, user ? parseInt(user.id) : null);
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