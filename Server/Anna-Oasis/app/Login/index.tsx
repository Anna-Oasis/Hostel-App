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

  const saveCredentials = async (email: string, password: string) => {
    try {
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
    } catch (error) {
      console.error("Error saving credentials:", error);
    }
  };

  const getCredentials = async () => {
    try {
      const email = await AsyncStorage.getItem("email");
      const password = await AsyncStorage.getItem("password");
      return { email, password };
    } catch (error) {
      console.error("Error retrieving credentials:", error);
      return { email: null, password: null };
    }
  };

  useEffect(() => {
    const checkTokenAndLogin = async () => {
      const token = await getToken();
      const { email, password } = await getCredentials();

      if (token && email && password) {
        try {
          const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email, password }),
          });

          if (response.ok) {
            const data = await response.json();
            Alert.alert("Welcome Back", `Hello, ${data.data.name}`);
            router.push("/Student/Home");
          } else {
            throw new Error("Invalid token or credentials");
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          Alert.alert("Session Expired", "Please log in again.");
          removeToken();
        }
      }
      setLoading(false);
    };

    checkTokenAndLogin();
  }, []);

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      await saveToken(data.data.token);
      await saveCredentials(values.email, values.password);
      Alert.alert("Login Successful", `Welcome, ${data.data.name}`);
      router.push("/Student/Home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginValidationSchema}
        onSubmit={handleLogin}
      >
        {({
          handleSubmit,
          values,
        }) => (
          <View>
            <TextField
              label="Email"
              placeholder="Email"
              value={values.email}
            />
            <TextField
              label="Password"
              placeholder="Password"
              value={values.password}
            />
            <Button onPress={() => handleSubmit()}>
              <ButtonText>Login</ButtonText>
            </Button>
            <Button onPress={() => router.push("/Signup")}>
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