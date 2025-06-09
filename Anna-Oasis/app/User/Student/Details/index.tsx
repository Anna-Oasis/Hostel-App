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
      validationSchema={validationSchemas[page]}
      onSubmit={async (values) => {
        if (page < 2) {
          next();
        } else {
          console.log("Personal details updated:", values);
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