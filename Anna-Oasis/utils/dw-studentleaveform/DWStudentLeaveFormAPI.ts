import api from "@/api";
import { getToken } from "@/utils/authUtils";

// Fetch all student leave forms for Deputy Warden approval
export async function fetchDeputyWardenLeaveForms() {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.get("/api/deputy_warden/student_leave", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch leave forms");
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch leave forms");
  }
}

// Approve or reject a leave form
export async function updateDeputyWardenLeaveFormStatus(leaveFormId: number, approve: boolean, comment?: string) {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const payload: any = { approve };
    if (!approve && comment) payload.comment = comment;
    const res = await api.put(`/api/deputy_warden/student_leave/${leaveFormId}`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to update leave form status");
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to update leave form status");
  }
}