import api from "@/api";
import { getToken } from "@/utils/authUtils";

// Fetch all vacating hostel applications for RC
export async function fetchRCVacatingApplications() {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.get("/api/resident_counsellor/vacating_hostel", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetched RC vacating applications:", res.data.data);
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch applications");
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch applications");
  }
}

// Approve a vacating hostel application
export async function approveRCVacatingApplication(vacating_hostel_id: number) {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.put(
      "/api/resident_counsellor/vacating_hostel",
      { vacating_hostel_id, approve: true },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to approve application");
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to approve application");
  }
}

// Reject a vacating hostel application
export async function rejectRCVacatingApplication(vacating_hostel_id: number, comment: string) {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.put(
      "/api/resident_counsellor/vacating_hostel",
      { vacating_hostel_id, approve: false, comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to reject application");
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to reject application");
  }
}