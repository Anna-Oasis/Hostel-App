import GrievanceForm from "@/components/GrievanceForm";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, Text } from "react-native";
import ModalCallable from "@/components/ModalCallable";
import { useState } from "react";
import { handleGrievance } from "@/utils/student/studentGrievanceApi";
import useLoadingStore from "@/stores/loadingStore";
import GrievanceHistory from "@/components/student/GrievanceHistory";
import { FilePen, History } from "lucide-react-native";
import { Button, ButtonText } from "@/components/ui/button";

export default function GrievancesPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [activeTab, setActiveTab] = useState<"file" | "history">("file");
  const router = useRouter();

  const setLoading = useLoadingStore((state) => state.setLoading);
  const handleSubmit = async (values: any) => {
    const success = await handleGrievance(values);

    if (success) {
      setShowModal(true);
      setModalContent(
        "Your grievance has been successfully submitted. We will review it and get back to you shortly."
      );
      setModalTitle("Grievance Submitted");
      setTimeout(() => {
        redirectToHome();
      }, 3000);
    } else {
      setShowModal(true);
      setModalContent("OOPS! Something went wrong");
      setModalTitle("Oops!");
      setTimeout(() => {
        redirectToHome();
      }, 3000);
    }
  };
  const redirectToHome = () => {
    if (!showModal) {
      router.replace("/User/Student");
    }
  };

  return (
    <View className="bg-white flex-1 p-0">
      <View className="flex-row justify-around items-center  pt-4 ">
        <Button
          variant="link"
          className={`flex-1 flex-row items-center justify-center py-2 border-b-2 ${
            activeTab === "file" ? "border-black" : "border-transparent"
          }`}
          onPress={() => setActiveTab("file")}
        >
          <FilePen
            size={20}
            color={activeTab === "file" ? "black" : "gray"}
          />
          <ButtonText
            className={`ml-2 text-base font-semibold ${
              activeTab === "file" ? "text-black" : "text-gray-500"
            }`}
            style={{ textDecorationLine: "none" }}
          >
            File Grievance
          </ButtonText>
        </Button>
        <Button
          variant="link"
          className={`flex-1 flex-row items-center justify-center py-2 border-b-2 ${
            activeTab === "history" ? "border-black" : "border-transparent"
          }`}
          onPress={() => setActiveTab("history")}
        >
          <History
            size={20}
            color={activeTab === "history" ? "black" : "gray"}
          />
          <ButtonText
            className={`ml-2 text-base font-semibold ${
              activeTab === "history" ? "text-black" : "text-gray-500"
            }`}
            style={{ textDecorationLine: "none" }}
          >
            History
          </ButtonText>
        </Button>
      </View>

      {/* Tab Content */}
      <View className="flex-1 p-6">
        {activeTab === "file" ? (
          <>
            <GrievanceForm
              onSubmit={(values) => {
                setLoading(true);
                handleSubmit(values);
                setLoading(false);
              }}
            />
          </>
        ) : (
          <GrievanceHistory />
        )}
        <ModalCallable
          show={showModal}
          onClose={() => setShowModal(false)}
          title={modalTitle}
          message={modalContent}
        />
      </View>
    </View>
  );
}
