import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";

const API_BASE_URL = "http://localhost:5000";

const TOKEN_KEY = "authToken";

export const saveCredentials = async (email: string, password: string) => {
  try {
    await AsyncStorage.setItem("email", email);
    await AsyncStorage.setItem("password", password);
  } catch (error) {
    console.error("Error saving credentials:", error);
  }
};

export const getCredentials = async () => {
  try {
    const email = await AsyncStorage.getItem("email");
    const password = await AsyncStorage.getItem("password");
    return { email, password };
  } catch (error) {
    console.error("Error retrieving credentials:", error);
    return { email: null, password: null };
  }
};

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export const saveUserRole = async (role: string) => {
  try {
    await AsyncStorage.setItem("userRole", role);
  } catch (error) {
    console.error("Error saving user role:", error);
  }
};
export const getUserRole = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("userRole");
  } catch (error) {
    console.error("Error retrieving user role:", error);
    return null;
  }
};

export const handleLogin = async (
  values: { email: string; password: string },
  onSuccess: () => void
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
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
    await saveUserRole(data.data.role);
    Alert.alert("Login Successful", `Welcome, ${data.data.name}`);
    onSuccess();
  } catch (error: any) {
    Alert.alert("Login Failed", error.message);
  }
};

export const handleSignup = async (
  values: { name: string; email: string; password: string },
  onSuccess: () => void
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Signup failed");
    }

    Alert.alert("Signup Successful", "You can now log in.");
    onSuccess();
  } catch (error: any) {
    Alert.alert("Signup Failed", error.message);
  }
};

export const redirectByRole = (role: string | null) => {
  switch (role) {
    case "student":
      router.replace("/User/Student");
      break;
    case "warden":
      router.replace("/ExecutiveWarden");
      break;
    case "rc":
      router.replace("/RC");
      break;
    case "deputyWarden":
      router.replace("/DeputyWarden");
      break;
    case "executiveWarden":
      router.replace("/ExecutiveWarden");
      break;
    case "manager":
      router.replace("/Manager");
      break;
    default:
      console.error("Unknown user role:", role);
      router.replace("/Login");
      break;
  }
};
