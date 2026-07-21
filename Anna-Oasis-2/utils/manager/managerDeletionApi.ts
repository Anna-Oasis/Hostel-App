import api from "@/api";
import { getToken } from "../authUtils";


export async function deleteStudentProfile(rollNumber : string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    console.log(rollNumber)
    const response = await api.delete(`/api/manager/delete/profile/${rollNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    window.alert(response.data.message);
  } catch (error: any) {
    window.alert(["Fetch Error", error.response?.data?.message ||
        "An error occurred while deleting Profile"].filter(Boolean).join("\n"));
    throw error;
  }
}

export async function deleteStudentAdmission(rollNumber : string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.delete(`/api/manager/delete/admission/${rollNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    window.alert(response.data.message);
  } catch (error: any) {
    window.alert(["Fetch Error", error.response?.data?.message ||
        "An error occurred while deleting Admission"].filter(Boolean).join("\n"));
    throw error;
  }
}
