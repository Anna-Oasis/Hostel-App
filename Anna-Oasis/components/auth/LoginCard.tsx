import { View, Alert } from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import PasswordField from "../form/PasswordField";
import { handleLogin, getToken, verifyToken } from "@/utils/authUtils";
import { redirectByRole } from "@/utils/authUtils";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { loginValidationSchema } from "@/utils/auth/authValidation";

const LoginCard = () => {
  const router = useRouter();
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginValidationSchema}
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
          <PasswordField
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
            <ButtonText className="text-white font-semibold">Login</ButtonText>
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
  );
};

export function DebugRouter() {
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

export default LoginCard;
