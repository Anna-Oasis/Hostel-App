import { getToken } from "../authUtils";
import { Alert } from "react-native";
import api from "@/api";
import { router } from "expo-router";

export const fetchDeputyWardenDetails = async () => {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.get("/api/deputy_warden/details", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (err: any) {
    window.alert("Error\nFailed to fetch details.");
  }
};

export const handleEnterDeputyWardenDetails = async (
  formData: FormData
) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.post(
      "/api/deputy_warden/details",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    window.alert(
      `Error\n${
        err.response?.data?.message ??
        "Failed to submit Deputy Warden details."
      }`
    );
  }
};

export const updateDeputyWardenDetails = async (
  formData: FormData
) => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.put(
      "/api/deputy_warden/details",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.data;
  } catch (err: any) {
    window.alert(
      `Error\n${
        err.response?.data?.message ??
        "Failed to update Deputy Warden details."
      }`
    );
  }
};