import api from "@/api";
import { getToken } from "@/utils/authUtils";

// Fetch all vacating hostel forms for manager approval
export async function fetchManagerVacatingForms() {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.get("/api/manager/vacating_hostel", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to fetch forms");
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch forms");
  }
}

// Approve a vacating hostel form as manager
export async function approveManagerVacatingForm(
  vacating_hostel_id: number,
  deductions: string,
  refund_amount: string,
  deduction_details: string
) {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.put(
      `/api/manager/vacating_hostel/${vacating_hostel_id}`,
      {
        approve: true,
        deductions,
        refund_amount,
        deduction_details,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to approve form");
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to approve form");
  }
}

// Reject a vacating hostel form as manager
export async function rejectManagerVacatingForm(
  vacating_hostel_id: number,
  comment: string,
  deductions: string,
  refund_amount: string,
  deduction_details: string
) {
  try {
    const token = await getToken();
    if (!token) throw new Error("You are not logged in.");
    const res = await api.put(
      `/api/manager/vacating_hostel/${vacating_hostel_id}`,
      {
        approve: false,
        comment,
        deductions,
        refund_amount,
        deduction_details,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.data?.success) throw new Error(res.data?.message || "Failed to reject form");
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Failed to reject form");
  }
}