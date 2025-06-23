import { useState, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Formik } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import { initialValues } from "@/constants/details";
import validationSchemas from "@/constants/detailsValidation";
import StudentDetails from "@/components/details/StudentDetails";
import ParentDetails from "@/components/details/ParentDetails";
import LocalGuardian from "@/components/details/LocalGuardian";
import FileUploads from "@/components/details/FileUploads";
import useLoadingStore from "@/stores/loadingStore";
import useUserStore from "@/stores/userStore";
import { submitStudentDetails, updateStudentDetails, getStudentDetails } from "@/utils/student/studentDetailsApi";
import testValues from "@/test/detailsTest";

export default function DetailsPage() {
  const [page, setPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const userId = useUserStore((state) => state.userId);
  const details = useUserStore((state) => state.details);
  const setDetails = useUserStore((state) => state.setDetails);

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
    <Formik
      initialValues={details ? { ...initialValues, ...details } : initialValues}
      // initialValues={testValues} // For testing purposes, replace with initialValues in production
      validationSchema={validationSchemas[page]}
      onSubmit={async (values) => {
        if (page < 3) {
          next();
        } else {
          setLoading(true);
          const formData = new FormData();
          formData.append("user_id", userId?.toString() || "");
          formData.append("name", values.name);
          formData.append("rollNo", values.rollNo);
          formData.append("course", values.course);
          formData.append("branch", values.branch);
          formData.append("semester", values.semester);
          formData.append("mobile", values.mobile);
          formData.append("email", values.email);
          formData.append("emergencyContact", values.emergencyContact);
          formData.append("dateOfBirth", values.dateOfBirth);
          formData.append("age", values.age);
          formData.append("gender", values.gender);
          formData.append("nationality", values.nationality);
          formData.append("bloodGroup", values.bloodGroup);
          formData.append("medicalHistory", values.medicalHistory);
          formData.append("fatherName", values.fatherName);
          formData.append("fatherOccupation", values.fatherOccupation);
          formData.append("fatherMobile", values.fatherMobile);
          formData.append("fatherEmail", values.fatherEmail);
          formData.append("fatherCountry", values.fatherCountry);
          formData.append("motherName", values.motherName);
          formData.append("motherOccupation", values.motherOccupation);
          formData.append("motherMobile", values.motherMobile);
          formData.append("motherEmail", values.motherEmail);
          formData.append("motherCountry", values.motherCountry);
          formData.append("resIndiaHouseNo", values.resIndiaHouseNo);
          formData.append("resIndiaStreet", values.resIndiaStreet);
          formData.append("resIndiaCity", values.resIndiaCity);
          formData.append("resIndiaState", values.resIndiaState);
          formData.append("resIndiaCountry", "India");
          formData.append("resIndiaPostalCode", values.resIndiaPostalCode);
          formData.append("resForeignHouseNo", values.resForeignHouseNo);
          formData.append("resForeignStreet", values.resForeignStreet);
          formData.append("resForeignCity", values.resForeignCity);
          formData.append("resForeignState", values.resForeignState);
          formData.append("resForeignCountry", values.resForeignCountry);
          formData.append("resForeignPostalCode", values.resForeignPostalCode);
          formData.append("localGuardianName", values.localGuardianName);
          formData.append("localGuardianRelationship", values.localGuardianRelationship);
          formData.append("localGuardianMobile", values.localGuardianMobile);
          formData.append("localGuardianEmail", values.localGuardianEmail);
          formData.append("guardianHouseNo", values.guardianHouseNo);
          formData.append("guardianStreet", values.guardianStreet);
          formData.append("guardianCity", values.guardianCity);
          formData.append("guardianState", values.guardianState);
          formData.append("guardianCountry", values.guardianCountry);
          formData.append("guardianPostalCode", values.guardianPostalCode);
          formData.append("govtIdType", values.govtIdType);
          formData.append("govtId", values.govtId);
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
            const uri = values[field.key as ImageFieldKey];
            if (uri) {
              const filename = uri.split("/").pop() || "image.jpg";
              const match = /\.(\w+)$/.exec(filename);
              const type = match ? `image/${match[1]}` : "image";
              formData.append(field.name, {
                uri,
                name: filename,
                type,
              } as any);
            }
          }

          if (!details) {
            await submitStudentDetails(formData);
          } else {
            await updateStudentDetails(details.rollNo, formData);
          }

          try {
            const fresh = await getStudentDetails();
            if (fresh && fresh.success) {
              setDetails(fresh.data);
            }
          } catch (e) {
            console.error("Failed to fetch updated details:", e);
          }
          setLoading(false);
        }
      }}
    >
      {({ handleSubmit, validateForm }) => (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            padding: 20,
            gap: 12,
            flexDirection: "column",
          }}
        >
          <View>
            {renderPage()}

            <View className="flex-row justify-between mt-6">
              {page > 0 && (
                <Button onPress={prev} variant="outline">
                  <ButtonText>Back</ButtonText>
                </Button>
              )}

              <Button
                onPress={async () => {
                  const formErrors = await validateForm();
                  if (Object.keys(formErrors).length > 0) {
                    console.log("Formik validation errors:", formErrors);
                  }
                  handleSubmit();
                }}
              >
                <ButtonText>{page < 3 ? "Next" : "Update Details"}</ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
}
