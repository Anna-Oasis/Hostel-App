import { useState } from "react";
import { View } from "react-native";
import { Formik } from "formik";
import VacatingForm from "@/components/hostelvacation/VacatingForm";
import CautionDepositForm from "@/components/hostelvacation/CautionDepositForm";
import { initialValues as vacateInitialValues } from "@/constants/vacatingHostels";
import { initialValues as depositInitialValues, validationSchema as depositValidationSchema } from "@/constants/validations/cautionDepositValidation";
import { validationSchema as vacateValidationSchema } from "@/constants/validations/vacatingHostelValidation";
import { submitStudentVacatingForm } from "@/utils/student/studentVacatingHostelApi";
import useUserStore from "@/stores/userStore";
import TabSwitch from "@/components/TabSwitch";
import HostelVacationHistory from "@/components/hostelvacation/HostelVacationHistory";
import { FilePlus2, History } from "lucide-react-native";
import ModalCallable from "@/components/modals/ModalCallable";

const initialValues = {
  ...vacateInitialValues,
  ...depositInitialValues,
};

const validationSchemas = [
  vacateValidationSchema,
  depositValidationSchema,
];

export default function HostelVacationPage() {
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const [showSuccess, setShowSuccess] = useState(false);
  const details = useUserStore((state) => state.details);

  const handleNext = () => setPage((p) => p + 1);
  const handleBack = () => setPage((p) => p - 1);

  const handleSubmit = async (values: any) => {
    if (page === 0) {
      handleNext();
      return;
    }
    const roll_number = details?.rollNo || "";
    const vacatingValues = {
      vacateDate: values.vacateDate,
      vacateTime: values.vacateTime,
      futureAddress: values.futureAddress,
      itemsReturned: values.itemsReturned,
    };
    const cautionDepositValues = {
      accountHolderName: values.accountHolderName,
      accountNumber: values.accountNumber,
      bankName: values.bankName,
      bankAddress: values.bankAddress,
      ifscCode: values.ifscCode,
    };
    const success = await submitStudentVacatingForm(roll_number, vacatingValues, cautionDepositValues);
    if (success) {
      setShowSuccess(true);
    }
  };

  const handleModalClose = () => {
    setShowSuccess(false);
    setActiveTab("history");
    setPage(0);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TabSwitch
        tabs={[
          { label: "Vacation Form", value: "form" },
          { label: "History", value: "history" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        icons={{
          form: FilePlus2,
          history: History,
        }}
        className="mt-4 mb-2"
      />
      {activeTab === "form" ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[page]}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleSubmit }) => (
            <>
              {page === 0 && <VacatingForm onNext={handleSubmit} />}
              {page === 1 && (
                <CautionDepositForm
                  onSubmit={handleSubmit}
                  onBack={handleBack}
                />
              )}
            </>
          )}
        </Formik>
      ) : (
        <HostelVacationHistory />
      )}
      <ModalCallable
        show={showSuccess}
        onClose={handleModalClose}
        title="Success"
        message="Your hostel vacation form has been submitted successfully."
      />
    </View>
  );
}