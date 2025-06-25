import { useState } from "react";
import VacatingForm from "@/components/hostelvacation/VacatingForm";
import CautionDepositForm from "@/components/hostelvacation/CautionDepositForm";
import { View } from "react-native";
import HostelVacationHistory from "@/components/hostelvacation/HostelVacationHistory";
import { FilePen, History } from "lucide-react-native";
import useUserStore from "@/stores/userStore";
import TabSwitch from "@/components/TabSwitch";
import ModalCallable from "@/components/ModalCallable";
import { initialValues as vacatingInitialValues } from "@/constants/vacatingHostels";
import { initialValues as cautionDepositInitialValues } from "@/constants/validations/cautionDepositValidation";
import { submitStudentVacatingForm } from "@/utils/student/studentVacatingHostelApi";

export default function HostelVacationFlow() {
  const [step, setStep] = useState<1 | 2>(1);
  const [vacatingFormData, setVacatingFormData] = useState<FormData | null>(null);
  const [vacatingValues, setVacatingValues] = useState<any>(vacatingInitialValues);
  const [cautionDepositValues, setCautionDepositValues] = useState<any>(cautionDepositInitialValues);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const roll_number = useUserStore((state) => state.details.rollNo);

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
      <TabSwitch
        tabs={[
          { label: "Hostel Vacation Form", value: "form" },
          { label: "History", value: "history" },
        ]}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="bg-gray-100 pt-4"
        icons={{
          form: FilePen,
          history: History,
        }}
      />
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
                const response = await submitStudentVacatingForm(roll_number, vacatingValues, values);

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
        <ModalCallable
          show={showModal}
          onClose={() => setShowModal(false)}
          title="Success"
          message="Submitted successfully!"
        />
      </View>
    </View>
  );
}