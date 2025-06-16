import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { handleLogin, getToken, verifyToken } from "@/utils/authUtils";
import { redirectByRole } from "@/utils/authUtils";

export default function Login() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-white px-4"
      contentContainerClassName="flex-grow justify-center py-10"
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6 pb-10">
          <View className="items-center mb-12">
            <Text className="text-3xl font-bold text-gray-900 mt-4 mb-2">
              Anna Oasis
            </Text>
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-48 h-48 my-8"
              resizeMode="contain"
            />
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
              handleLogin(values, async () => {
                const token = await getToken();
                if (token) {
                  const user = await verifyToken(token);
                  if (user) {
                    console.log(
                      "Login successful, redirecting based on role...",
                      user.role
                    );
                    redirectByRole(user.role);
                  } else {
                    Alert.alert("Error", "Invalid token, please login again.");
                  }
                }
              })
            }
          >
            {({ handleSubmit }) => (
              <View className="space-y-4">
                <TextField
                  label="Email"
                  placeholder="Enter your email"
                  value="email"
                />
                <TextField
                  label="Password"
                  placeholder="Enter your password"
                  value="password"
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
                {/* <DebugRouter /> */}
              </View>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

function DebugRouter() {
  const router = useRouter();
  
  const debugRoutes: [string, string][] = [
    ["/User/Student", "STUDENT"],
    ["/Manager", "MANAGER"],
    ["/RC", "RC"],
    ["/DeputyWarden", "DW"],
    ["/ExecutiveWarden", "EW"],
  ];

  return (
    <View>
      {debugRoutes.map(([route, label]) => (
        <Button
          key={label}
          size="lg"
          variant="outline"
          action="secondary"
          className="mt-3 rounded-lg border-2 border-slate-500"
          onPress={() => router.push(route as any)}
        >
          <ButtonText className="text-slate-500 font-semibold">
            DEBUG {label} LOGIN
          </ButtonText>
        </Button>
      ))}
    </View>
  );
}
