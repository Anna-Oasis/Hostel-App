import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";
import { router } from "expo-router";
import useUserStore from "@/stores/userStore";

export async function submitSummerVacationRequest(data: {
  vacation_from: string;
  vacation_time: string;
  roll_number?: string;
  address_of_stay: string;
  returned_items: string[];
}) {
  const token = await getToken();
  // const roll_number = useUserStore((state) => state.details.rollNo);
  // console.log("Submitting summer vacation request with data:", data, roll_number);
  const requestData = {
    ...data,
    roll_number:  useUserStore.getState().details?.rollNo,
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

export interface SummerVacationFormResponse {
  success: boolean;
  message: string;
  data: SummerVacationForm[];
}

export interface SummerVacationForm {
  id: number;
  roll_number: string;
  vacation_from: string; // ISO date string
  address_of_stay: string;
  returned_items: string[]; // List of returned hostel items
  status: VacationFormStatus; // "2" | "0" | "-1"
  created_at: string; // ISO date
  updated_at: string; // ISO date
}

export type VacationFormStatus = "0" | "2" | "-1" | "1"; 

export const VacationStatusMap: Record<VacationFormStatus, string> = {
  "0": "Pending",
  "2": "Approved",
  "-1": "Rejected",
  "1" : "Pending ( Approved by RC )",
};

export async function fetchSummerVacationForms(roll_number : string): Promise<SummerVacationFormResponse> {
  const token = await getToken();
  try {
    const response = await api.get(`/api/student/summer_vacation/${roll_number}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch summer vacation forms:", error);
    throw error;
  }
}