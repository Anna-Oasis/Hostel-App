import api from "@/api";
import { getToken } from "../authUtils";

const applicationFormPath = "/api/manager/forms/application-form";
const roomAllotmentFormPath = "/api/manager/forms/room-allotment-form";
const reAdmissionFormPath = "/api/manager/forms/re-admission-form";

async function getFormSource(path: string) {
  try {
    const token = await getToken();

    if (!token) throw new Error("No authentication token found");

    const response = await api.get(path, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      uri: URL.createObjectURL(response.data),
    };
  } catch (error: any) {
    // console.error(error);
    window.alert(error?.response?.data?.message || error?.message || "Failed to load form.");
    throw error;
  }
}

async function downloadForm(
  path: string,
  fileName: string,
  studentId: string
) {
  try {
    const token = await getToken();

    if (!token) throw new Error("No authentication token found");

    const response = await api.get(`${path}/${studentId}`, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    // console.error(error);
    window.alert(error?.response?.data?.message || error?.message || "Failed to download form.");
    throw error;
  }
}

async function openForm(path: string) {
  try {
    const token = await getToken();

    if (!token) throw new Error("No authentication token found");

    const response = await api.get(path, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const url = window.URL.createObjectURL(response.data);

    window.open(url, "_blank");

    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 5000);
  } catch (error: any) {
    // console.error(error);
    window.alert(error?.response?.data?.message || error?.message || "Failed to open form.");
    throw error;
  }
}

export function getApplicationFormSource() {
  return getFormSource(applicationFormPath);
}

export function getReAdmissionFormSource() {
  return getFormSource(reAdmissionFormPath);
}

export function getRoomAllotmentFormSource() {
  return getFormSource(roomAllotmentFormPath);
}

export function openApplicationForm() {
  return openForm(applicationFormPath);
}

export function openRoomAllotmentForm() {
  return openForm(roomAllotmentFormPath);
}

export function openReAdmissionForm() {
  return openForm(reAdmissionFormPath);
}


export function downloadRoomAllotmentForm(studentId : string) {
  return downloadForm(roomAllotmentFormPath, "room-allotment-form.pdf", studentId);
}

export function downloadApplicationForm(studentId : string) {
  return downloadForm(applicationFormPath, "application-form.pdf", studentId);
}


export function downloadReAdmissionForm(studentId : string) {
  return downloadForm(reAdmissionFormPath, "re-admission-form.pdf", studentId);
}

