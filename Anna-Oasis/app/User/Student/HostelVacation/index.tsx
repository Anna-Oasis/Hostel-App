import React, { useState } from "react";
import VacatingForm from "@/components/hostelvacation/VacatingForm";
import CautionDepositForm from "@/components/hostelvacation/CautionDepositForm";
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { initialValues as vacatingInitialValues } from "@/constants/vacatingHostels";
import { initialValues as cautionDepositInitialValues } from "@/constants/validations/cautionDepositValidation";
import { submitStudentVacatingForm } from "@/utils/vacatingHostelUtils";
import { View } from "react-native";
import HostelVacationHistory from "@/components/hostelvacation/HostelVacationHistory";
import { FilePen, History } from "lucide-react-native";
import useUserStore from "@/stores/userStore";

export default function HostelVacationFlow() {
  const [step, setStep] = useState<1 | 2>(1);
  const [vacatingFormData, setVacatingFormData] = useState<FormData | null>(null);
  const [vacatingValues, setVacatingValues] = useState<any>(vacatingInitialValues);
  const [cautionDepositValues, setCautionDepositValues] = useState<any>(cautionDepositInitialValues);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const roll_number = useUserStore((state) => state.details.rollNo);

  // Reset forms and step when switching to form tab
  const handleTabChange = (tab: "form" | "history") => {
    setActiveTab(tab);
    if (tab === "form") {
      setStep(1);
      setVacatingValues(vacatingInitialValues);
      setCautionDepositValues(cautionDepositInitialValues);
    }
  };

  return (
    <View className="bg-white flex-1 p-0">
      {/* Tabs */}
      <View className="flex-row justify-around items-center bg-gray-100 pt-4">
        <Button
          variant="link"
          className={`flex-1 flex-row items-center justify-center py-2 border-b-2 ${
            activeTab === "form" ? "border-black" : "border-transparent"
          }`}
          onPress={() => handleTabChange("form")}
        >
          <FilePen
            size={20}
            color={activeTab === "form" ? "black" : "gray"}
          />
          <ButtonText
            className={`ml-2 text-base font-semibold ${
              activeTab === "form" ? "text-black" : "text-gray-500"
            }`}
            style={{ textDecorationLine: "none" }}
          >
            Hostel Vacation Form
          </ButtonText>
        </Button>
        <Button
          variant="link"
          className={`flex-1 flex-row items-center justify-center py-2 border-b-2 ${
            activeTab === "history" ? "border-black" : "border-transparent"
          }`}
          onPress={() => handleTabChange("history")}
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
        {activeTab === "form" ? (
          step === 1 ? (
            <VacatingForm
              initialValues={vacatingValues}
              onNext={(formData, values) => {
                setVacatingFormData(formData);
                setVacatingValues(values);
                setStep(2);
              }}
            />
          ) : (
            <CautionDepositForm
              initialValues={cautionDepositValues}
              onSubmit={async (cautionFormData, values) => {
                setCautionDepositValues(values);
                console.log("Caution Deposit Values:", values);
                console.log("Vacating Form Data:", vacatingFormData);
                const response = await submitStudentVacatingForm(roll_number,vacatingValues, values);
                console.log("Submission Response:", response);

                if (response === true) {
                  setShowModal(true);
                  setTimeout(() => {
                    setShowModal(false);
                    setActiveTab("history");
                  }, 3000);
                } else {
                  setShowModal(false);
                }
              }}
              onBack={(values) => {
                setCautionDepositValues(values);
                setStep(1);
              }}
            />
          )
        ) : (
          <HostelVacationHistory />
        )}

        {/* Success Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ModalBackdrop />
          <ModalContent>
            <ModalHeader>
              <Text className="text-lg font-semibold">Success</Text>
            </ModalHeader>
            <ModalBody>
              <Text className="text-base text-green-700">Submitted successfully!</Text>
            </ModalBody>
            <ModalFooter>
              <Button onPress={() => setShowModal(false)}>
                <ButtonText>OK</ButtonText>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </View>
    </View>
  );
}