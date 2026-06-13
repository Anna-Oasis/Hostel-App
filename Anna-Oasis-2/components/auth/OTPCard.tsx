import { View, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
});

interface OtpSectionProps {
  email: string;
  onVerifyOtp: (values: { otp: string }) => void;
  onResendOtp: () => void;
}

export default function OtpSection({
  email,
  onVerifyOtp,
  onResendOtp,
}: OtpSectionProps) {
  return (
    <View className="bg-white rounded-2xl p-6 mt-6 shadow-sm border border-gray-100">
      <Text className="text-xl font-bold text-gray-900 mb-2">
        Enter OTP
      </Text>

      <Text className="text-gray-600 mb-1">
        Verification code sent to
      </Text>

      <Text className="font-semibold text-[#022B60] mb-5">
        {email}
      </Text>

      <Formik
        initialValues={{ otp: "" }}
        validationSchema={otpSchema}
        onSubmit={onVerifyOtp}
      >
        {({ handleSubmit }) => (
          <View className="space-y-4">
            <TextField
              placeholder="Enter 6-digit OTP"
              value="otp"
              label="OTP"
            />

            <Button
              size="lg"
              className="mt-4 rounded-lg bg-[#022B60]"
              onPress={() => handleSubmit()}
            >
              <ButtonText className="text-white font-semibold">
                Verify OTP
              </ButtonText>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="mt-3 rounded-lg border-[#022B60]"
              onPress={onResendOtp}
            >
              <ButtonText className="text-[#022B60]">
                Resend OTP
              </ButtonText>
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}