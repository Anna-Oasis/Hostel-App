import api from "@/api";
import { getToken } from "@/utils/authUtils";

// Fetch all RCs
export async function fetchRCs() {
  const token = await getToken();
  if (!token) throw new Error("You are not logged in.");
  const res = await api.get("/api/deputy_warden/rc", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch RCs");
  return res.data.data;
}

// Add a new RC
export async function addRC(formData: FormData) {
  const token = await getToken();
  if (!token) throw new Error("You are not logged in.");
  const data: any = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  const res = await api.post("/api/deputy_warden/rc", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to add RC");
  return res.data.data;
}

// Remove an RC
export async function removeRC(rcId: string) {
  const token = await getToken();
  if (!token) throw new Error("You are not logged in.");
  const res = await api.delete(`/api/deputy_warden/rc/${rcId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to remove RC");
  return res.data;
}

// Assign floors to an RC
export async function assignFloors(rcId: string, payload: { name: string; hostel: string; floor: number[] }) {
  const token = await getToken();
  if (!token) throw new Error("You are not logged in.");
  const res = await api.put(`/api/deputy_warden/rc/${rcId}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.data?.success) throw new Error(res.data?.message || "Failed to assign floors");
  return res.data.data;
}