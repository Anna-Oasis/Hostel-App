import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { router } from "expo-router";
import api from "@/api";
import useUserStore, { User } from "../stores/userStore";

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
    window.alert(["Login Successful", `Welcome, ${data.data.name}`].filter(Boolean).join("\n"));
    onSuccess();
  } catch (error: any) {
    window.alert(["Login Failed", error.response?.data?.message || error.message].filter(Boolean).join("\n"));
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
      window.alert("Session Expired\nPlease log in again.");
      await removeToken();
      router.replace("/Login");
      return null;
    }
    window.alert(["Token Verification Failed", error.response?.data?.message || error.message].filter(Boolean).join("\n"));
    return null;
  }
};

export const handleSignup = async (
  values: { name: string; email: string; password: string },
  onSuccess: () => void
) => {
  try {
    const response = await api.post("/register", values);
    // console.log("Signup API response:", response.data);
    window.alert("Signup Successful\nYou can now log in.");
    onSuccess();
  } catch (error: any) {
    window.alert(["Signup Failed", error.response?.data?.message || error.message].filter(Boolean).join("\n"));
  }
};

export const handleForgotPassword = async (
  email: string,
  onSuccess: () => void
) => {
  try {
    await api.post("/forgot-password", { email });
    window.alert("Code Sent\nA verification code has been sent to your email.");
    onSuccess();
  } catch (error: any) {
    window.alert(["Error", error.response?.data?.message || error.message].filter(Boolean).join("\n"));
  }
};

export const handleVerifyOtp = async (
  email: string,
  otp: string,
  onSuccess: (resetToken: string) => void
) => {
  try {
    const response = await api.post("/verify-otp", { email, otp });
    onSuccess(response.data.resetToken);
  } catch (error: any) {
    window.alert(["Invalid Code", error.response?.data?.message || error.message].filter(Boolean).join("\n"));
  }
};

export const handleResetPassword = async (
  resetToken: string,
  newPassword: string,
  onSuccess: () => void
) => {
  try {
    await api.post(
      "/reset-password",
      { newPassword },
      { headers: { Authorization: `Bearer ${resetToken}` } }
    );
    window.alert("Success\nYour password has been updated. Please log in.");
    onSuccess();
  } catch (error: any) {
    window.alert(["Reset Failed", error.response?.data?.message || error.message].filter(Boolean).join("\n"));
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
