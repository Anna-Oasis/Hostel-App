import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";

export async function fetchStudentDetails() {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.get("/api/deputy_warden/getdetails", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch manager details");
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch manager details");
  }
}