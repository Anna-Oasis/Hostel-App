import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";

const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
});

const EmailSection = ({
  onSendOtp,
}: {
  onSendOtp: (values: { email: string }) => void;
}) => {
  return (
    <View className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow justify-center py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center px-6 pb-10">
            <View className="items-center mb-12">
              <Text className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                Verify Email
              </Text>
              <Text className="text-base text-gray-600">
                Enter your registerd email to receive an OTP
              </Text>
            </View>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={emailSchema}
              onSubmit={onSendOtp}
            >
              {({ handleSubmit }) => (
                <View className="space-y-4">
                  <TextField
                    placeholder="Enter your email"
                    value="email"
                    label="Email Address"
                  />

                  <Button
                    size="lg"
                    variant="solid"
                    action="primary"
                    className="mt-6 rounded-lg bg-[#022B60]"
                    onPress={() => handleSubmit()}
                  >
                    <ButtonText className="text-white font-semibold">
                      Send OTP
                    </ButtonText>
                  </Button>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default EmailSection;