import { getToken } from "../authUtils";
import api from "@/api";
import { appendImageToFormData } from "../imageHelper";


export interface FeePaymentRequestBody {
  roll_number: string;
  academicYear: string;
  studentAgreed: boolean;
  parentAgreed: boolean;
  previousResident: boolean;
  hostelBlock: string;
  messPreference: string;
  transaction_id: string;
  transactionPhotoUrl?: string; // file URI
}
export async function checkFeePaymentEligible(semester: string, roll_number : string) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }
    const response = await api.get(
      `/api/student/feePayment/eligible/${semester}`,
      {
        params : {
          roll_number : roll_number
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    window.alert(["Fetch Error", error.response?.data?.message ||
        "An error occurred while fetching Fee Payment data"].filter(Boolean).join("\n"));
    throw error;
  }
}


export async function submitStudentFeePayment(data: FeePaymentRequestBody) {
  try {
    const token = await getToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const formData = new FormData();
    formData.append("roll_number", data.roll_number);
    formData.append("academicYear", data.academicYear);
    formData.append("studentAgreed", String(data.studentAgreed));
    formData.append("parentAgreed", String(data.parentAgreed));
    formData.append("previousResident", String(data.previousResident));
    formData.append("hostelBlock", data.hostelBlock);
    formData.append("messPreference", data.messPreference);
    formData.append("transaction_id", data.transaction_id);

    appendImageToFormData(formData, "transactionPhotoUrl", data.transactionPhotoUrl);
    // console.log(formData)
    const response = await api.post("/api/student/feePayment", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    // console.log("Fee Payment response:", response.data);
    window.alert("Fee Payment Successful\nYour Fee Payment request has been successfully submitted. You can check your Fee Payment status");
    return response.data;
  } catch (error: any) {
    window.alert(["Fee Payment Error", error.response?.data?.message || "An error occurred during Fee Payment"].filter(Boolean).join("\n"));
  }
}