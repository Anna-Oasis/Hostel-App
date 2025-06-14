import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";
import api from "@/api"; // <-- import the axios instance
import { User } from "../stores/userStore"; // <-- import the User type

const TOKEN_KEY = "authToken";

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

export const handleLogin = async (
  values: { email: string; password: string },
  onSuccess: () => void
) => {
  try {
    const response = await api.post("/login", values);

    const data = response.data;
    await saveToken(data.data.token);
    Alert.alert("Login Successful", `Welcome, ${data.data.name}`);
    onSuccess();
  } catch (error: any) {
    Alert.alert("Login Failed", error.response?.data?.message || error.message);
  }
};



/**
 * 
 * @param token - The JWT token to verify
 * @description Verifies the JWT token by making a request to the backend.
 * If the token is valid, it returns the user's role. If the token is expired or invalid,
 * it alerts the user and redirects them to the login page.
 * @returns {Promise<User | null>} - Returns the user's information if the token is valid, otherwise returns null.
 */
export const verifyToken = async (token: string): Promise<User | null> => {
  try {
    const response = await api.get("/verify-token", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = response.data;
    return data.user;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Alert.alert("Token Expired", "Please log in again.");
      await removeToken();
      router.replace("/Login");
      return null;
    }
    Alert.alert("Token Verification Failed", error.response?.data?.message || error.message);
    return null;
  }
};

export const handleSignup = async (
  values: { name: string; email: string; password: string },
  onSuccess: () => void
) => {
  try {
    const response = await api.post("/register", values);
    console.log("Signup API response:", response.data);
    Alert.alert("Signup Successful", "You can now log in.");
    onSuccess();
  } catch (error: any) {
    Alert.alert("Signup Failed", error.response?.data?.message || error.message);
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
