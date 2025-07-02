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
  transactionPhotoUrl?: string; // file URI
}

export async function submitStudentAdmission(data: AdmissionRequestBody) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const formData = new FormData();
    formData.append("roll_number", data.roll_number);
    formData.append("academicYear", data.academicYear);
    formData.append("studentAgreed", String(data.studentAgreed));
    formData.append("parentAgreed", String(data.parentAgreed));
    formData.append("previousResident", String(data.previousResident));
    formData.append("hostelBlock", data.hostelBlock);
    formData.append("messPreference", data.messPreference);
    formData.append("transaction_id", data.transaction_id);

    if (data.transactionPhotoUrl) {
      const uriParts = data.transactionPhotoUrl.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("transactionPhotoUrl", {
        uri: data.transactionPhotoUrl,
        name: `transaction.${fileType}`,
        type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
      } as any);
    }
    console.log(data)
    const response = await api.post("/api/student/admission", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
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
      error.response?.data?.message || "An error occurred during admission"
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
