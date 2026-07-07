import { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Formik } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import { initialValues } from "@/constants/details";
import validationSchemas from "@/constants/validations/detailsValidation";
import StudentDetails from "@/components/details/StudentDetails";
import ParentDetails from "@/components/details/ParentDetails";
import LocalGuardian from "@/components/details/LocalGuardian";
import FileUploads from "@/components/details/FileUploads";
import useLoadingStore from "@/stores/loadingStore";
import useUserStore from "@/stores/userStore";
import { submitStudentDetails, updateStudentDetails, getStudentDetails } from "@/utils/student/studentDetailsApi";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appendImageToFormData } from "@/utils/imageHelper";

const FORM_STORAGE_KEY = "student_details_form_draft";

export default function DetailsPage() {
  const [page, setPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const userId = useUserStore((state) => state.userId);
  const details = useUserStore((state) => state.details);
  const setDetails = useUserStore((state) => state.setDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load draft from AsyncStorage on mount
  const [draftLoaded, setDraftLoaded] = useState(false);

  // Helper to save form values to AsyncStorage
  const saveDraft = async (values: any) => {
    try {
      await AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(values));
    } catch (e) {
      // console.warn("Failed to save draft:", e);
    }
  };

  // Helper to clear draft from AsyncStorage
  const clearDraft = async () => {
    try {
      await AsyncStorage.removeItem(FORM_STORAGE_KEY);
    } catch (e) {
      // console.warn("Failed to clear draft:", e);
    }
  };

  // Load draft values if available
  const [initialFormValues, setInitialFormValues] = useState(
    details ? { ...initialValues, ...details } : initialValues
  );

  useEffect(() => {
    (async () => {
      try {
        const draft = await AsyncStorage.getItem(FORM_STORAGE_KEY);
        if (draft) {
          setInitialFormValues({ ...initialValues, ...JSON.parse(draft) });
        } else if (details) {
          setInitialFormValues({ ...initialValues, ...details });
        }
      } catch (e) {
        // fallback to details or initialValues
        setInitialFormValues(details ? { ...initialValues, ...details } : initialValues);
      }
      setDraftLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  const next = () => {
    setPage((p) => p + 1);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 0);
  };

  const prev = () => setPage((p) => p - 1);

  const renderPage = () => {
    switch (page) {
      case 0:
        return <StudentDetails />;
      case 1:
        return <ParentDetails />;
      case 2:
        return <LocalGuardian />;
      case 3:
        return <FileUploads />;
      default:
        return null;
    }
  };

  return (
    draftLoaded && (
      <Formik
        initialValues={initialFormValues}
        validationSchema={validationSchemas[page]}
        onSubmit={async (values) => {
          setIsSubmitting(true);
          if (page < 3) {
            next();
            await saveDraft(values);
            setIsSubmitting(false);
          } else {
            const formData = new FormData();
            const trimmedValues : any = Object.fromEntries(
              Object.entries(values).map(([key, value]) => [
                key,
                typeof value === "string" ? value.trim() : value,
              ])
            );
            formData.append("user_id", userId?.toString() || "");
            formData.append("name", trimmedValues.name);
            formData.append("rollNo", trimmedValues.rollNo);
            formData.append("course", trimmedValues.course);
            formData.append("branch", trimmedValues.branch);
            formData.append("semester", trimmedValues.semester);
            formData.append("mobile", trimmedValues.mobile);
            formData.append("email", trimmedValues.email);
            formData.append("emergencyContact", trimmedValues.emergencyContact);
            formData.append("dateOfBirth", trimmedValues.dateOfBirth);
            formData.append("age", trimmedValues.age);
            formData.append("gender", trimmedValues.gender);
            formData.append("admissionCategory", trimmedValues.admissionCategory);
            if (trimmedValues.admissionCategory === "Other" && trimmedValues.admissionCategoryReason) {
              formData.append("admissionCategoryReason", trimmedValues.admissionCategoryReason);
            }
            formData.append("nationality", trimmedValues.nationality);
            formData.append("bloodGroup", trimmedValues.bloodGroup);
            formData.append("medicalHistory", trimmedValues.medicalHistory);
            formData.append("fatherName", trimmedValues.fatherName);
            formData.append("fatherOccupation", trimmedValues.fatherOccupation);
            formData.append("fatherMobile", trimmedValues.fatherMobile);
            formData.append("fatherEmail", trimmedValues.fatherEmail);
            formData.append("fatherCountry", trimmedValues.fatherCountry);
            formData.append("motherName", trimmedValues.motherName);
            formData.append("motherOccupation", trimmedValues.motherOccupation);
            formData.append("motherMobile", trimmedValues.motherMobile);
            formData.append("motherEmail", trimmedValues.motherEmail);
            formData.append("motherCountry", trimmedValues.motherCountry);
            formData.append("resIndiaHouseNo", trimmedValues.resIndiaHouseNo);
            formData.append("resIndiaStreet", trimmedValues.resIndiaStreet);
            formData.append("resIndiaCity", trimmedValues.resIndiaCity);
            formData.append("resIndiaState", trimmedValues.resIndiaState);
            formData.append("resIndiaCountry", "India");
            formData.append("resIndiaPostalCode", trimmedValues.resIndiaPostalCode);
            formData.append("resForeignHouseNo", trimmedValues.resForeignHouseNo);
            formData.append("resForeignStreet", trimmedValues.resForeignStreet);
            formData.append("resForeignCity", trimmedValues.resForeignCity);
            formData.append("resForeignState", trimmedValues.resForeignState);
            formData.append("resForeignCountry", trimmedValues.resForeignCountry);
            formData.append("resForeignPostalCode", trimmedValues.resForeignPostalCode);
            formData.append("localGuardianName", trimmedValues.localGuardianName);
            formData.append("localGuardianRelationship", trimmedValues.localGuardianRelationship);
            formData.append("localGuardianMobile", trimmedValues.localGuardianMobile);
            formData.append("localGuardianEmail", trimmedValues.localGuardianEmail);
            formData.append("guardianHouseNo", trimmedValues.guardianHouseNo);
            formData.append("guardianStreet", trimmedValues.guardianStreet);
            formData.append("guardianCity", trimmedValues.guardianCity);
            formData.append("guardianState", trimmedValues.guardianState);
            formData.append("guardianCountry", trimmedValues.guardianCountry);
            formData.append("guardianPostalCode", trimmedValues.guardianPostalCode);
            formData.append("govtIdType", trimmedValues.govtIdType);
            formData.append("govtId", trimmedValues.govtId);
            const imageFields = [
              { key: "passportPhotoUrl", name: "passportPhotoUrl" },
              { key: "studentSignatureUrl", name: "studentSignatureUrl" },
              {
                key: "parentGuardianSignatureUrl",
                name: "parentGuardianSignatureUrl",
              },
              { key: "categoryProofUrl", name: "categoryProofUrl" },
              { key: "admissionSlipUrl", name: "admissionSlipUrl" },
            ] as const;
            type ImageFieldKey = (typeof imageFields)[number]["key"];
            for (const field of imageFields) {
              appendImageToFormData(formData, field.name, trimmedValues[field.key])
            }
            if (details === null || details.length === 0) {
              await submitStudentDetails(formData);
            } else {
              await updateStudentDetails(details.rollNo, formData);
            }

            try {
              const fresh = await getStudentDetails();
              if (fresh && fresh.count > 0) {
                setDetails(fresh.data);
                await clearDraft();
                router.replace("/User/Student")
              }
            } catch (e) {
              // console.error("Failed to fetch updated details:", e);
            }
            setIsSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, validateForm, values }) => (
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{
              padding: 20,
              gap: 12,
              flexDirection: "column",
            }}
          >
            <View className='w-full sm:w-[80%] md:w-[60%] self-center'>
              {renderPage()}

              <View className="flex-row justify-between mt-6">
                {page > 0 && (
                  <Button
                    onPress={prev}
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    <ButtonText>Back</ButtonText>
                  </Button>
                )}

                <Button
                  onPress={async () => {
                    const formErrors = await validateForm();
                    if (Object.keys(formErrors).length > 0) {
                      console.log("Formik validation errors:", formErrors);
                    }
                    // Save draft on next, clear on submit
                    if (page < 3) {
                      await saveDraft(values);
                    }
                    handleSubmit();
                  }}
                  disabled={isSubmitting}
                >
                  <ButtonText>
                    {isSubmitting
                      ? "Submitting..."
                      : page < 3
                        ? "Save and next"
                        : "Update Details"}
                  </ButtonText>
                </Button>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    )
  );
}
