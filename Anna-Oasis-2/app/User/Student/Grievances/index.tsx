import GrievanceForm from "@/components/student/GrievanceForm";
import { useRouter } from "expo-router";
import { View } from "react-native";
import ModalCallable from "@/components/modals/ModalCallable";
import { useState } from "react";
import { handleGrievance } from "@/utils/student/studentGrievanceApi";
import useLoadingStore from "@/stores/loadingStore";
import GrievanceHistory from "@/components/student/GrievanceHistory";
import { FilePen, History } from "lucide-react-native";
import TabSwitch from "@/components/TabSwitch";

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
      {/* Tabs */}
      <TabSwitch
        tabs={[
          { label: "File Grievance", value: "file" },
          { label: "History", value: "history" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="pt-4"
        icons={{
          file: FilePen,
          history: History,
        }}
      />

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
