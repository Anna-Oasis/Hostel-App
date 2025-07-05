import React from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import PasswordField from "@/components/form/PasswordField";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { validationSchema } from "@/utils/auth/authValidation";

const Signup = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6 pb-10">
        <View className="items-center mb-12">
          <Text className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            Create Account
          </Text>
          <Text className="text-base text-gray-600">
            Sign up to get started
          </Text>
        </View>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ handleSubmit }) => (
            <View className="space-y-4">
              <TextField
                placeholder="Enter your full name"
                value="name"
                label="Full Name"
              />
              
              <TextField
                placeholder="Enter your email"
                value="email"
                label="Email Address"
              />
              
              <PasswordField
                placeholder="Create a password"
                value="password"
                label="Password"
              />
              
              <PasswordField
                placeholder="Confirm your password"
                value="confirmPassword"
                label="Confirm Password"
              />

              <Button 
                size="lg"
                variant="solid"
                action="primary"
                className="mt-6 rounded-lg bg-[#022B60]"
                onPress={() => handleSubmit()}
              >
                <ButtonText className="text-white font-semibold">
                  Create Account
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
                  Already have an account? Login
                </ButtonText>
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Signup;
