import api from "@/api";
import { getToken } from "@/utils/authUtils";

// Fetch manager details
export async function fetchStudentDetailsForVerification() {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.get("/api/manager/details", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch manager details");
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch manager details");
  }
}

// Approve or decline a student profile
export async function updateStudentProfileApproval(approve: boolean, rollNo: string, comment: string) {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.put(
      `/api/manager/details/${rollNo}`,
      { approve, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to update profile approval");
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to update profile approval");
  }
}
