import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";

export const handleGrievance = async (requestBody: {
  grievance_type: string;
  subject: string;
  description: string;
}) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("User is not authenticated");
    const response = await api.post("/api/student/grievance", requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.success;
  } catch (error: any) {
    console.log(`Error :  ${error.message}`);
    Alert.alert(
      "Error",
      error.response?.data?.message ||
        "An error occurred while submitting the grievance"
    );
    return false;
  }
};

export const getHistoryOfGrievance = async () => {
  try {
    const token = await getToken();
    if (!token) throw new Error("User is not authenticated");
    const response = await api.get(`/api/student/grievance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.log(`Error :  ${error.message}`);
    Alert.alert(
      "Error",
      error.response?.data?.message ||
        "An error occurred while fetching grievance history"
    );
    return false;
  }
};
