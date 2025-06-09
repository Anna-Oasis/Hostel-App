import { useState, useRef } from "react";
import { ScrollView, View, Text } from "react-native";
import { Formik } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import { initialValues } from "@/constants/details";
import validationSchemas from "@/constants/detailsValidation";
import StudentDetails from "@/components/details/StudentDetails";
import ParentDetails from "@/components/details/ParentDetails";
import LocalGuardian from "@/components/details/LocalGuardian";
import FileUploads from "@/components/details/FileUploads";

export default function DetailsPage() {
  const [page, setPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

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
        return <FileUploads />
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={validationSchemas[page]}
      onSubmit={async (values) => {
        if (page < 3) {
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
          formData.append("govtIdType", values.govtIdType);
          formData.append("govtId", values.govtId);
          const imageFields = [
            { key: "passportPhoto", name: "images[passportPhoto]" },
            { key: "studentSignature", name: "images[studentSignature]" },
            { key: "parentGuardianSignature", name: "images[parentGuardianSignature]" },
            { key: "govtIdDocument", name: "images[govtIdDocument]" },
            { key: "aadhaar", name: "images[aadhaar]" },
            { key: "admissionSlip", name: "images[admissionSlip]" }
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
            <Text className="text-xl font-bold mb-4">
              {page === 0 ? "Personal Information" : 
               page === 1 ? "Parents Information" : 
               "Local Guardian Information"}
            </Text>
            
            {renderPage()}
            
            <View
              style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}
            >
              {page > 0 && (
                <Button onPress={prev} variant="outline">
                  <ButtonText>Back</ButtonText>
                </Button>
              )}
              
              <Button onPress={() => handleSubmit()}>
                <ButtonText>{page < 2 ? "Next" : "Update Details"}</ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
}