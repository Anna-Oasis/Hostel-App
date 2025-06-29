import api from "@/api";
import { getToken } from "@/utils/authUtils";

// Fetch all vacating hostel forms for Deputy Warden approval
export async function fetchDWVacatingForms() {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.get("/api/deputy_warden/vacating_hostel", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch forms");
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch forms");
  }
}

// Approve a vacating hostel form as Deputy Warden
export async function approveDWVacatingForm(vacating_hostel_id: number) {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.put(
      `/api/deputy_warden/vacating_hostel/${vacating_hostel_id}`,
      { approve: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to approve form");
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to approve form");
  }
}

// Reject a vacating hostel form as Deputy Warden
export async function rejectDWVacatingForm(vacating_hostel_id: number, reason: string) {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.put(
      `/api/deputy_warden/vacating_hostel/${vacating_hostel_id}`,
      { approve: false, comment: `${reason} (Rejected by Deputy Warden)` },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to reject form");
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to reject form");
  }
}