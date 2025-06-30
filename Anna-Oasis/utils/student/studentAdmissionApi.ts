import api from "@/api";
import { Alert } from "react-native";
import { getToken } from "../authUtils";

export interface AdmissionRequestBody {
  roll_number: string;
  academicYear: string;
  studentAgreed: boolean;
  parentAgreed: boolean;
  previousResident: boolean;
  hostelBlock: string;
  messPreference: string;
  transaction_id: string;
}

export async function submitStudentAdmission(data: AdmissionRequestBody) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.post("/api/student/admission", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Admission response:", response.data);
    Alert.alert(
      "Admission Successful",
      "Your admission request has been successfully submitted. You can check your admission status"
    );
    return response.data;
  } catch (error: any) {
    Alert.alert(
      "Admission Error",
      error.response.data.message || "An error occurred during admission"
    );
  }
}

export async function getStudentAdmissionStatus(roll_no: string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(
      `/api/student/admission/student/${roll_no}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    Alert.alert(
      "Fetch Error",
      error.response?.data?.message ||
        "An error occurred while fetching admission status"
    );
    throw error;
  }
}

export async function getAdmissionSession(semester: string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(
      `/api/student/admission/session/${semester}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    Alert.alert(
      "Fetch Error",
      error.response?.data?.message ||
        "An error occurred while fetching admission session data"
    );
    throw error;
  }
}
