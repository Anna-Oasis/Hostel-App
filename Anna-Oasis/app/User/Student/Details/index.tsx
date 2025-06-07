import { useState, useRef } from "react";
import { ScrollView, View, Text } from "react-native";
import { Formik } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import { initialValues } from "@/constants/admission"; // Reusing the same initial values
import validationSchemas from "@/utils/admission/admissionValidation";
import StudentDetails from "@/components/admission/StudentDetails";
import ParentDetails from "@/components/admission/ParentDetails";
import LocalGuardian from "@/components/admission/LocalGuardian";

export default function DetailsPage() {
  const [page, setPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-xl font-bold mb-4">Details Updated Successfully</Text>
        <Button onPress={() => setIsSubmitted(false)}>
          <ButtonText>Edit Details</ButtonText>
        </Button>
      </View>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas[page]}
      onSubmit={async (values) => {
        if (page < 2) {
          next();
        } else {
          // Here you would submit the form data to your backend
          console.log("Personal details updated:", values);
          
          // For demonstration, just showing submission success
          setIsSubmitted(true);
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