import { useState, useRef, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import { initialValues } from "@/constants/admission";
import validationSchemas from "@/constants/admissionValidation";
import HostelMessDeclaration from "@/components/admission/HostelMessDeclaration";
import PreviewPage from "@/components/admission/PreviewPage";
import AdmissionDetails from "@/components/admission/AdmissionDetails";
import useUserStore from "@/stores/userStore";
import { router } from "expo-router";
import { submitStudentAdmission } from "@/utils/student/studentAdmissionApi";
import useLoadingStore from "@/stores/loadingStore";
import AdmissionHistory from "./History/index"; // You'll implement this

const AdmissionForm = () => {
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const scrollViewRef = useRef<ScrollView>(null);
  const details = useUserStore((state) => state.details);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const currentYear = new Date().getFullYear();
  const gender = details?.gender;

  if (!details) {
    router.replace("/User/Student/Details/Edit");
    return null;
  }

  const next = () => {
    setPage((p) => p + 1);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 0);
  };
  const prev = () => setPage((p) => p - 1);

  const renderPage = (handleSubmit: () => void, values: any) => {
    switch (page) {
      case 0:
        return <AdmissionDetails />;
      case 1:
        return <HostelMessDeclaration />;
      case 2:
        return <PreviewPage onEdit={prev} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Tab Header */}
      <View className="flex-row justify-around mt-4 mb-2">
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${
            activeTab === "form" ? "border-black" : "border-gray-200"
          }`}
          onPress={() => setActiveTab("form")}
        >
          <Text
            className={`text-lg font-semibold ${
              activeTab === "form" ? "text-black" : "text-gray-500"
            }`}
          >
            Admission Form
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center border-b-2 ${
            activeTab === "history" ? "border-black" : "border-gray-200"
          }`}
          onPress={() => setActiveTab("history")}
        >
          <Text
            className={`text-lg font-semibold ${
              activeTab === "history" ? "text-black" : "text-gray-500"
            }`}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === "form" ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchemas[page]}
          onSubmit={async (values) => {
            if (page < 2) {
              next();
            } else {
              const declaration = values.declaration || [];
              const details = useUserStore.getState().details;
              const academicYear = `${currentYear}-${currentYear + 1}`;
              const requestBody = {
                roll_number: details?.rollNo || "",
                academicYear,
                studentAgreed: declaration.includes("studentAgreed"),
                parentAgreed: declaration.includes("parentAgreed"),
                admissionCategory: values.admissionCategory || "",
                previousResident: values.previousResident === "Yes",
                hostelBlock: values.hostelBlock || "",
                messPreference: values.messPreference || "",
                transaction_id: values.transactionId,
              };
              setLoading(true);
              await submitStudentAdmission(requestBody);
              setLoading(false);
              setActiveTab("history"); // redirect to history tab after submission
            }
          }}
        >
          {({ handleSubmit, values, setFieldValue }) => {
            useEffect(() => {
              if (gender === "male" && values.hostelBlock !== "Flora") {
                setFieldValue("hostelBlock", "Flora");
              } else if (
                gender === "female" &&
                values.hostelBlock !== "Lavendar"
              ) {
                setFieldValue("hostelBlock", "Lavendar");
              }
            }, [gender, setFieldValue]);

            const hostelBlock = values.hostelBlock;

            return (
              <ScrollView ref={scrollViewRef}>
                <View className="m-4 flex gap-3">
                  {hostelBlock && (
                    <View>
                      <Text className="mb-2 font-semibold">
                        Admission for hostel block {hostelBlock} for the year{" "}
                        {currentYear}
                      </Text>
                    </View>
                  )}
                  {renderPage(handleSubmit, values)}
                  <View className="flex-row justify-between">
                    {page < 2 && (
                      <>
                        {page > 0 && (
                          <Button onPress={prev}>
                            <ButtonText>Back</ButtonText>
                          </Button>
                        )}
                        <Button onPress={() => handleSubmit()}>
                          <ButtonText>Next</ButtonText>
                        </Button>
                      </>
                    )}
                  </View>
                </View>
              </ScrollView>
            );
          }}
        </Formik>
      ) : (
        <AdmissionHistory />
      )}
    </View>
  );
};

export default AdmissionForm;
