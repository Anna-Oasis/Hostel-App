import { getToken } from "../authUtils";
import { Alert } from "react-native";
import api from "@/api";
import { router } from "expo-router";

export const fetchdata = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.get("/api/resident_counsellor/details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (err: any) {
    window.alert("Error\nFailed to fetch details.");
  }
};

export const updateDetails = async (formData: any) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.put(
      "/api/resident_counsellor/details",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    window.alert("Success\nDetails updated successfully");
    setTimeout(() => router.push("/RC/Details" as any), 1000);
  } catch (err: any) {
    window.alert(["Error", err.message || "Something went wrong. Please try again."].filter(Boolean).join("\n"));
  }
};

export const handleEnterDetails = async (formData: any) => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.post(
      "/api/resident_counsellor/details",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    window.alert("Success\nDetails entered successfully");
    setTimeout(() => router.push("/RC/Details" as any), 1000);
  } catch (err: any) {
    window.alert(["Error", err.message || "Something went wrong. Please try again."].filter(Boolean).join("\n"));
  }
};
