import api from "@/api";
import { getToken } from "@/utils/authUtils";

// Helper to validate status for Axios
function validateStatus(status: number) {
  // Treat 302 as a valid status (not an error)
  return (status >= 200 && status < 300) || status === 302;
}

// Submit a new leave form (as JSON)
export async function submitLeaveForm(payload: any) {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");

    const res = await api.post("/api/student/leave", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.data?.success) throw new Error(res.data?.message || "Failed to submit leave form");
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to submit leave form");
  }
}

// Fetch all leave forms for a student
export async function fetchLeaveForms(roll_number: number) {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");

    const res = await api.get(`/api/student/leave/${roll_number}`, {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus,
    });

    if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch leave forms");
    return res.data.data;
  } catch (err: any) {
    if (err.response) {
      console.log("Error response data:", err.response.data);
      console.log("Error response status:", err.response.status);
      console.log("Error response headers:", err.response.headers);
    } else if (err.request) {
      console.log("No response received:", err.request);
    } else {
      console.log("Error", err.message);
    }
    throw new Error(err.message || "Failed to fetch leave forms");
  }
}