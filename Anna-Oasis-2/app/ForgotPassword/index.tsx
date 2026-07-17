import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import PasswordField from "@/components/form/PasswordField";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import {
  forgotPasswordValidationSchema,
  otpValidationSchema,
  resetPasswordValidationSchema,
} from "@/utils/auth/authValidation";
import {
  handleForgotPassword,
  handleVerifyOtp,
  handleResetPassword,
} from "@/utils/authUtils";

type Step = 1 | 2 | 3;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

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

            {/* ── Step 1: Email ── */}
            {step === 1 && (
              <>
                <View className="items-center mb-12">
                  <Text className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                    Forgot Password
                  </Text>
                  <Text className="text-base text-gray-600 text-center">
                    Enter your registered email to receive a verification code
                  </Text>
                </View>

                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={forgotPasswordValidationSchema}
                  onSubmit={({ email: emailVal }) =>
                    handleForgotPassword(emailVal, () => {
                      setEmail(emailVal);
                      setStep(2);
                    })
                  }
                >
                  {({ handleSubmit }) => (
                    <View className="space-y-4">
                      <TextField
                        label="Email Address"
                        placeholder="Enter your email"
                        value="email"
                        // keyboardType="email-address"
                        // autoCapitalize="none"
                      />
                      <Button
                        size="lg"
                        variant="solid"
                        action="primary"
                        className="mt-6 rounded-lg bg-[#022B60]"
                        onPress={() => handleSubmit()}
                      >
                        <ButtonText className="text-white font-semibold">
                          Send Code
                        </ButtonText>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        action="secondary"
                        className="mt-3 rounded-lg border-2 border-[#022B60]/80"
                        onPress={() => router.push("/Login")}
                      >
                        <ButtonText className="text-[#022B60]/80 font-semibold">
                          Back to Login
                        </ButtonText>
                      </Button>
                    </View>
                  )}
                </Formik>
              </>
            )}

            {/* ── Step 2: OTP ── */}
            {step === 2 && (
              <>
                <View className="items-center mb-12">
                  <Text className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                    Enter Code
                  </Text>
                  <Text className="text-base text-gray-600 text-center">
                    Enter the 6-digit code sent to{"\n"}{email}
                  </Text>
                </View>

                <Formik
                  initialValues={{ otp: "" }}
                  validationSchema={otpValidationSchema}
                  onSubmit={({ otp }) =>
                    handleVerifyOtp(email, otp, (token) => {
                      setResetToken(token);
                      setStep(3);
                    })
                  }
                >
                  {({ handleSubmit }) => (
                    <View className="space-y-4">
                      <TextField
                        label="Verification Code"
                        placeholder="Enter 6-digit code"
                        value="otp"
                        // keyboardType="numeric"
                        // maxLength={6}
                      />
                      <Button
                        size="lg"
                        variant="solid"
                        action="primary"
                        className="mt-6 rounded-lg bg-[#022B60]"
                        onPress={() => handleSubmit()}
                      >
                        <ButtonText className="text-white font-semibold">
                          Verify Code
                        </ButtonText>
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        action="secondary"
                        className="mt-3 rounded-lg border-2 border-[#022B60]/80"
                        onPress={() => setStep(1)}
                      >
                        <ButtonText className="text-[#022B60]/80 font-semibold">
                          Back
                        </ButtonText>
                      </Button>
                    </View>
                  )}
                </Formik>
              </>
            )}

            {/* ── Step 3: New Password ── */}
            {step === 3 && (
              <>
                <View className="items-center mb-12">
                  <Text className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                    New Password
                  </Text>
                  <Text className="text-base text-gray-600 text-center">
                    Create a strong new password for your account
                  </Text>
                </View>

                <Formik
                  initialValues={{ password: "", confirmPassword: "" }}
                  validationSchema={resetPasswordValidationSchema}
                  onSubmit={({ password }) =>
                    handleResetPassword(resetToken, password, () =>
                      router.replace("/Login")
                    )
                  }
                >
                  {({ handleSubmit }) => (
                    <View className="space-y-4">
                      <PasswordField
                        label="New Password"
                        placeholder="Enter new password"
                        value="password"
                      />
                      <PasswordField
                        label="Confirm Password"
                        placeholder="Confirm new password"
                        value="confirmPassword"
                      />
                      <Button
                        size="lg"
                        variant="solid"
                        action="primary"
                        className="mt-6 rounded-lg bg-[#022B60]"
                        onPress={() => handleSubmit()}
                      >
                        <ButtonText className="text-white font-semibold">
                          Reset Password
                        </ButtonText>
                      </Button>
                    </View>
                  )}
                </Formik>
              </>
            )}

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}