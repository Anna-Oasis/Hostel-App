import { useEffect, useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { saveToken, getToken, removeToken } from "@/utils/auth/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginValidationSchema } from "@/utils/auth/authValidation";

export default function Login() {
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  //ROLE BASED ROUTE SWITCHING:
  //
  // let role = "Student";
  // switch (role) {
  //     case "Student":
  //       router.replace("/Student/Home");
  //       break;
  //     case "RC":
  //       router.replace("/RC");
  //       break;
  //     case "Manager":
  //       router.replace("/Manager");
  //       break;
  //     case "ExecutiveWarden":
  //       router.replace("/ExecutiveWarden");
  //       break;
  //     case "DeputyWarden":
  //       router.replace("/DeputyWarden");
  //       break;
  //     default:
  //       router.replace("/Login");
  //   }

  useEffect(() => {
    const checkTokenAndLogin = async () => {
      const token = await getToken();
      const { email, password } = await getCredentials();

      if (token && email && password) {
        handleLogin({ email, password }, () => {
          router.push("/Student/Home"); // Use router to navigate
        });
      }
      setLoading(false);
    };

    checkTokenAndLogin();
  }, [router]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
          password: Yup.string().required("Password is required"),
        })}
        onSubmit={(values) =>
          handleLogin(values, () => router.push("/Student/Home")) // Use router to navigate
        }
      >
        {({ handleSubmit }) => (
          <View>
            <TextField
              label="Email"
              placeholder="Email"
              value="email"
            />
            <TextField
              label="Password"
              placeholder="Password"
              value="password"
            />
            <Button onPress={() => handleSubmit()}>
              <ButtonText>Login</ButtonText>
            </Button>
            <Button onPress={() => router.push("/Signup")}> {/* Use router to navigate */}
              <ButtonText>Go to Signup</ButtonText>
            </Button>
            <Button onPress={() => router.push("/Student/Home")}>
              <ButtonText>[Debug] student home </ButtonText>
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5FCFF",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});