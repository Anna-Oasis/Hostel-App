import { useState, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Formik } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import { initialValues } from "@/constants/admission";
import validationSchemas from "@/constants/admissionValidation";
import HostelMessDeclaration from "@/components/admission/HostelMessDeclaration";
import PreviewPage from "@/components/admission/PreviewPage";
import PaymentPage from "@/components/admission/PaymentPage";
import AdmissionDetails from "@/components/admission/AdmissionDetails";

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
        return <AdmissionDetails />;
      case 1:
        return <PaymentPage />;
      case 2:
        return <HostelMessDeclaration />;
      case 3:
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
        if (page < 2) {
          next();
        } else {
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
              {page < 3 && (
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
