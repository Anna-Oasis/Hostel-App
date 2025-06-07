import React, { useEffect, useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { handleLogin, getToken, getCredentials, getUserRole } from "@/utils/authUtils";
import * as Yup from "yup";
import { useRouter } from "expo-router";

export default function Login() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkTokenAndLogin = async () => {
      const token = await getToken();
      const userRole = await getUserRole();
      const { email, password } = await getCredentials();

      if (token && email && password && userRole) {
        handleLogin({ email, password }, () => {
          // router.push("/Student/Home");
          switch (userRole) {
            case "student":
              router.push("/Student/Home");
              break;
            case "warden":
              router.push("/ExecutiveWarden");
              break;
            case "rc":
              router.push("/RC");
              break;
            case "deputyWarden":
              router.push("/DeputyWarden");
              break;
            case "executiveWarden":
              router.push("/ExecutiveWarden");
              break;
            case "manager":
              router.push("/Manager");
              break;
            default:
              console.error("Unknown user role:", userRole);
          }
        });
      }
      setLoading(false);
    };

    checkTokenAndLogin();
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-base text-gray-600">Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-6 pb-10">
        <View className="items-center mb-12">
          <Text className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            Welcome Back
          </Text>
          <Text className="text-base text-gray-600">Login to continue</Text>
        </View>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
            password: Yup.string().required("Password is required"),
          })}
          onSubmit={(values) =>
            handleLogin(values, () => router.push("/Student/Home"))
          }
        >
          {({ handleSubmit }) => (
            <View className="space-y-4">
              <TextField
                label="Email"
                placeholder="Enter your email"
                value="email"
              // className="bg-gray-50 rounded-lg"
              />
              <TextField
                label="Password"
                placeholder="Enter your password"
                value="password"
              // className="bg-gray-50 rounded-lg"
              />

              <Button
                size="lg"
                variant="solid"
                action="primary"
                className="mt-6 rounded-lg bg-slate-900"
                onPress={() => handleSubmit()}
              >
                <ButtonText className="text-white font-semibold">
                  Login
                </ButtonText>
              </Button>

              <Button
                size="lg"
                variant="outline"
                action="secondary"
                className="mt-3 rounded-lg border-2 border-slate-500"
                onPress={() => router.push("/Signup")}
              >
                <ButtonText className="text-slate-500 font-semibold">
                  Create Account
                </ButtonText>
              </Button>
              <View>
                <Button
                  size="lg"
                  variant="outline"
                  action="secondary"
                  className="mt-3 rounded-lg border-2 border-slate-500"
                  onPress={() => router.push("/Student/Home")}
                >
                  <ButtonText className="text-slate-500 font-semibold">
                    DEBUG STUUDENT LOGIN
                  </ButtonText>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  action="secondary"
                  className="mt-3 rounded-lg border-2 border-slate-500"
                  onPress={() => router.push("/Manager")}
                >
                  <ButtonText className="text-slate-500 font-semibold">
                    DEBUG MANAGER LOGIN
                  </ButtonText>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  action="secondary"
                  className="mt-3 rounded-lg border-2 border-slate-500"
                  onPress={() => router.push("/RC")}
                >
                  <ButtonText className="text-slate-500 font-semibold">
                    DEBUG RC LOGIN
                  </ButtonText>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  action="secondary"
                  className="mt-3 rounded-lg border-2 border-slate-500"
                  onPress={() => router.push("/DeputyWarden")}
                >
                  <ButtonText className="text-slate-500 font-semibold">
                    DEBUG DW LOGIN
                  </ButtonText>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  action="secondary"
                  className="mt-3 rounded-lg border-2 border-slate-500"
                  onPress={() => router.push("/ExecutiveWarden")}
                >
                  <ButtonText className="text-slate-500 font-semibold">
                    DEBUG EW LOGIN
                  </ButtonText>
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
}