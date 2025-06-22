import React, { useState } from "react";
import VacatingForm from "@/components/hostelvacation/VacatingForm";
import CautionDepositForm from "@/components/hostelvacation/CautionDepositForm";
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { initialValues as vacatingInitialValues } from "@/constants/vacatingHostels";
import { initialValues as cautionDepositInitialValues } from "@/constants/cautionDepositValidation";
import { submitStudentVacatingForm } from "@/utils/vacatingHostelUtils";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function HostelVacationFlow() {
  const [step, setStep] = useState<1 | 2>(1);
  const [vacatingFormData, setVacatingFormData] = useState<FormData | null>(null);
  const [vacatingValues, setVacatingValues] = useState<any>(vacatingInitialValues);
  const [cautionDepositValues, setCautionDepositValues] = useState<any>(cautionDepositInitialValues);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter()

  return (
    <>
      <View className="w-full flex items-end px-6 bg-white">
        <Button className="w-[50%]" onPress={() => router.push("/User/Student/HostelVacation/Histroy")}>
          <ButtonText>
            Show Histroy
          </ButtonText>
        </Button>
      </View>
      {step === 1 ? (
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
            // Combine both FormData objects if needed
            // const combinedFormData = new FormData();
            // // @ts-ignore
            // for (let [key, value] of vacatingFormData!.entries()) {
            //   combinedFormData.append(key, value);
            // }
            // // @ts-ignore
            // for (let [key, value] of cautionFormData.entries()) {
            //   combinedFormData.append(key, value);
            // }
            // console.log("Combined Form Data:", combinedFormData);
            console.log(cautionDepositValues)
            const response = await submitStudentVacatingForm(vacatingValues, values);

            if (response === true) {
              setShowModal(true);
              setTimeout(() => {
                router.push("/User/Student/HostelVacation/Histroy")
              }, 4000)
            } else {
              setShowModal(false);
            }
            // Example: send to backend here
            // await fetch("https://your-backend-api.com/hostel-vacation", { method: "POST", body: combinedFormData });

            // setShowModal(true);
          }}
          onBack={(values) => {
            setCautionDepositValues(values);
            setStep(1);
          }}
        />
      )}

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
    </>
  );
}