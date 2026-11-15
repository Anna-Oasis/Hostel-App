import { getToken } from "../authUtils";
import api from "@/api";

export async function getAllManagerFeePayments() {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get("/api/manager/feePayments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    window.alert(["Fetch Error", error.response?.data?.message ||
        "An error occurred while fetching payments"].filter(Boolean).join("\n"));
    throw error;
  }
}

export async function managerApprove(feePaymentId: string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.put(
      `/api/manager/feePayments/${feePaymentId}`,
      {
        approve: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.alert("Success\n payments approved successfully");
    return response.data;
  } catch (error: any) {
    window.alert(["Approval Error", error.response?.data?.message ||
        "An error occurred while approving the payments"].filter(Boolean).join("\n"));
    throw error;
  }
}

export async function managerDecline(feePaymentId: string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.put(
      `/api/manager/feePayments/${feePaymentId}`,
      {
        approve: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    window.alert("Success\n payments approved successfully");
    return response.data;
  } catch (error: any) {
    window.alert(["Approval Error", error.response?.data?.message ||
        "An error occurred while approving the payments"].filter(Boolean).join("\n"));
    throw error;
  }
}