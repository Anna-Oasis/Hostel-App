import { useState, useRef, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { Formik } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import { initialValues } from "@/constants/admission";
import validationSchemas from "@/constants/validations/admissionValidation";
import HostelMessDeclaration from "@/components/admission/HostelMessDeclaration";
import PreviewPage from "@/components/admission/PreviewPage";
import AdmissionDetails from "@/components/admission/AdmissionDetails";
import useUserStore from "@/stores/userStore";
import { router } from "expo-router";
import { submitStudentAdmission } from "@/utils/student/studentAdmissionApi";
import useLoadingStore from "@/stores/loadingStore";
import AdmissionHistory from "./History/index"; 
import TabSwitch from "@/components/TabSwitch";
import { FilePlus2, History as HistoryIcon } from "lucide-react-native";
import { getAdmissionSession } from "@/utils/student/studentAdmissionApi";

const AdmissionForm = () => {
  const [page, setPage] = useState(0);
  const [academicYear, setAcademicYear] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const [isSessionChecked, setIsSessionChecked] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const details = useUserStore((state) => state.details);
  const setLoading = useLoadingStore((state) => state.setLoading);
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

  useEffect(() => {
    const fetchAdmissionSession = async () => {
      try {
        const session = await getAdmissionSession(details.semester);
        if (!session.isOpen) {
          router.replace("/User/Student/Admission/Closed");
        } else {
          setIsSessionChecked(true);
          setAcademicYear(session.data.academic_year);
        }
      } catch (error) {
        console.error("Failed to fetch admission session:", error);
        setIsSessionChecked(true);
      }
    };
    fetchAdmissionSession();
  }, [details]);

  if (!isSessionChecked) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text>Checking admission session...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <TabSwitch
        tabs={[
          { label: "Admission Form", value: "form" },
          { label: "History", value: "history" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        icons={{
          form: FilePlus2,
          history: HistoryIcon,
        }}
        className="mt-4 mb-2"
      />

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
              const requestBody = {
                roll_number: details?.rollNo || "",
                academicYear: academicYear,
                studentAgreed: declaration.includes("studentAgreed"),
                parentAgreed: declaration.includes("parentAgreed"),
                previousResident: values.previousResident === "Yes",
                hostelBlock: values.hostelBlock || "",
                messPreference: values.messPreference || "",
                transaction_id: values.transactionId,
              };
              setLoading(true);
              await submitStudentAdmission(requestBody);
              setLoading(false);
              setActiveTab("history");
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
                        Admission for hostel block {hostelBlock} for the academic year {academicYear}
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

