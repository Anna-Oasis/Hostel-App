import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";
import { router } from "expo-router";

export async function submitSummerVacationRequest(data: {
  vacation_from: string;
  vacation_time: string;
  roll_number?: string;
  address_of_stay: string;
  returned_items: string[];
}) {
  const token = await getToken();
  const requestData = {
    ...data,
    roll_number: data.roll_number ?? "2025115003",
  };
  try {
    const response = await api.post("/api/student/summer_vacation", requestData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Leave request submitted successfully:", response.data);
    Alert.alert("Success", "Leave request has been submitted successfully");
    router.replace("/User/Student");
  } catch (error) {
    console.error("Failed to submit leave request:", error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response: any };
      console.log("Error response data:", err.response.data);
      console.log("Error response status:", err.response.status);
      console.log("Error response headers:", err.response.headers);
    }
  }
}