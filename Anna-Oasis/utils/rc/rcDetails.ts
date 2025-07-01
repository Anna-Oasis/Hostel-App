import { getToken } from "../authUtils";
import { Alert } from "react-native";
import api from "@/api";
import { router } from "expo-router";

export const fetchdata = async (
    rcDetailsStore : (data : any) => void) => {
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

    rcDetailsStore(response.data.data[0]);

  } catch (err: any) {
    Alert.alert("Error", "Failed to fetch details.");
  }
};

export const updateDetails = async (formData : any) => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await api.put('/api/resident_counsellor/details', formData, {
                headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert("Success", "Details updated successfully");
            setTimeout(() => router.push("/RC/Details" as any), 1000)

        } 
        catch (err: any) {
            Alert.alert("Error", err.message || "Something went wrong. Please try again.");
        }
};


export const handleEnterDetails = async (formData : any) => {
        try {
            const token = await getToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await api.post('/api/resident_counsellor/details', formData, {
                headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
                },
            });

            Alert.alert("Success", "Details entered successfully");
            setTimeout(() => router.push("/RC/Details" as any), 1000)

        } 
        catch (err: any) {
            Alert.alert("Error", err.message || "Something went wrong. Please try again.");
        }
};