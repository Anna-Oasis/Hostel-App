import { useState, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Formik } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import { initialValues } from "@/constants/admission";
import validationSchemas from "@/utils/admission/admissionValidation";
import StudentDetails from "@/components/details/StudentDetails";
import ParentDetails from "@/components/details/ParentDetails";
import LocalGuardian from "@/components/details/LocalGuardian";
import HostelMessDeclaration from "@/components/admission/HostelMessDeclaration";
import PreviewPage from "@/components/admission/PreviewPage";
import PaymentPage from "@/components/admission/PaymentPage";

const AdmissionForm = () => {
  const [page, setPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const next = () => {
    setPage((p) => p + 1);
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, 0);
  };
  const prev = () => setPage((p) => p - 1);

  const renderPage = (handleSubmit: () => void) => {
    switch (page) {
      case 0:
        return <StudentDetails />;
      case 1:
        return <ParentDetails />;
      case 2:
        return <LocalGuardian />;
      case 3:
        return <HostelMessDeclaration />;
      case 4:
        return <PaymentPage />;
      case 5:
        return <PreviewPage onEdit={prev} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  function getISTDateString() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(
      now.getTime() + istOffset - now.getTimezoneOffset() * 60000
    );
    return istTime.toISOString().slice(0, 10);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas[page]}
      onSubmit={async (values) => {
        if (page < 5) {
          next();
        } else {
          const formData = new FormData();
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
          formData.append("nationality", values.nationality);
          formData.append("govtId", values.govtId);
          formData.append("admissionCategory", values.admissionCategory);
          formData.append("bloodGroup", values.bloodGroup);
          formData.append("medicalHistory", values.medicalHistory);
          formData.append("hostelBlock", values.hostelBlock);
          formData.append(
            "previousResident",
            values.previousResident === "true" ? "true" : "false"
          );
          formData.append("messPreference", values.messPreference);
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
          formData.append("resIndiaCountry", values.resIndiaCountry);
          formData.append("resIndiaPostalCode", values.resIndiaPostalCode);
          formData.append("resForeignHouseNo", values.resForeignHouseNo);
          formData.append("resForeignStreet", values.resForeignStreet);
          formData.append("resForeignCity", values.resForeignCity);
          formData.append("resForeignState", values.resForeignState);
          formData.append("resForeignCountry", values.resForeignCountry);
          formData.append("resForeignPostalCode", values.resForeignPostalCode);
          formData.append("guardianName", values.guardianName);
          formData.append("guardianRelationship", values.guardianRelationship);
          formData.append("guardianMobile", values.guardianMobile);
          formData.append("guardianEmail", values.guardianEmail);
          formData.append("guardianHouseNo", values.guardianHouseNo);
          formData.append("guardianStreet", values.guardianStreet);
          formData.append("guardianCity", values.guardianCity);
          formData.append("guardianState", values.guardianState);
          formData.append("guardianCountry", values.guardianCountry);
          formData.append("guardianPostalCode", values.guardianPostalCode);
          formData.append(
            "studentAgreed",
            values.declaration.includes("studentAgreed") ? "true" : "false"
          );
          formData.append(
            "parentAgreed",
            values.declaration.includes("parentAgreed") ? "true" : "false"
          );
          formData.append("submissionDate", getISTDateString());
          formData.append("transactionId", values.transactionId);
          const imageFields = [
            { key: "passportPhoto", name: "images[passportPhoto]" },
            { key: "studentSignature", name: "images[studentSignature]" },
            { key: "parentGuardianSignature", name: "images[parentGuardianSignature]" }
          ] as const;
          type ImageFieldKey = typeof imageFields[number]["key"];
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
          console.log("FormData prepared for submission:", formData);
        }
      }}
    >
      {({ handleSubmit }) => (
        <ScrollView ref={scrollViewRef}>
          <View className="m-4 flex gap-3">
            {renderPage(handleSubmit)}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {page < 5 && (
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
      )}
    </Formik>
  );
};

export default AdmissionForm;
