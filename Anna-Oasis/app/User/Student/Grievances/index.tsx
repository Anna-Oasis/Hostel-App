import GrievanceForm from "@/components/GrievanceForm";
import { useRouter } from "expo-router";
import { View, Text } from "react-native";
import React, { useEffect } from "react";
import ModalCallable from "@/components/ModalCallable";
import useUserStore from "@/stores/userStore";
import { getToken, verifyToken } from "@/utils/authUtils";
import { useState, useRef } from "react";
import { handleGrievance } from "@/utils/grievanceUtils";
import useLoadingStore from "@/stores/loadingStore";
import { Button, ButtonText } from "@/components/ui/button";

export default function GrievancesPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("")
  const [modalTitle, setModalTitle] = useState("")
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const hasInitialized = useRef(false);
  const handleSubmit = async(values: any, id: Number | null) => {
      const success = await handleGrievance(values)

      if (success){
        setShowModal(true)
        setModalContent("Your grievance has been successfully submitted. We will review it and get back to you shortly.")
        setModalTitle("Grievance Submitted")
        setTimeout(() => {
          redirectToHome();
        }, 3000);
      }
      else{
        setShowModal(true)
        setModalContent("OOPS! Something went wrong")
        setModalTitle("Oops!")
        setTimeout(() => {
          redirectToHome();
        }, 3000);
      }
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
    <View className="bg-white flex-1 p-6">
      <GrievanceForm
        onSubmit={(values) => {
          setLoading(true)
          handleSubmit(values, user ? parseInt(user.id) : null);
          setLoading(false)
        }}
      />
      <View className="mt-4">
        <Button
          onPress={() => {
            setLoading(true)
            router.push("/User/Student/Grievances/Histroy")
            setLoading(false)
          }}
        >
          <ButtonText>Show History</ButtonText>
        </Button>
      </View>
      <ModalCallable
        show={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        message={modalContent}
      />
    </View>
  );
}