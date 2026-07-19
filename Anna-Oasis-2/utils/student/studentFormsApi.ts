import api from "@/api";
import { getToken } from "../authUtils";

const applicationFormPath = "/api/student/forms/application-form";
const roomAllotmentFormPath = "/api/student/forms/room-allotment-form";
const reAdmissionFormPath = "/api/student/forms/re-admission-form";

async function getFormSource(path: string) {
  const token = await getToken();

  if (!token) throw new Error("No authentication token found");

  const response = await api.get(path, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const blobUrl = URL.createObjectURL(response.data);

  return {
    uri: blobUrl,
  };
}

async function downloadForm(path: string, fileName: string) {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await api.get(path, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const blob = response.data;

  const url = window.URL.createObjectURL(blob);

  // Download
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}

async function openForm(path: string) {
  const token = await getToken();

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await api.get(path, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const url = window.URL.createObjectURL(response.data);

  window.open(url, "_blank");

  // Cleanup later so browser has time to load it
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 5000);
}

export function getApplicationFormSource() {
  return getFormSource(applicationFormPath);
}

export function downloadApplicationForm() {
  return downloadForm(applicationFormPath, "application-form.pdf");
}

export function openApplicationForm() {
  return openForm(applicationFormPath);
}

export function getRoomAllotmentFormSource() {
  return getFormSource(roomAllotmentFormPath);
}

export function downloadRoomAllotmentForm() {
  return downloadForm(roomAllotmentFormPath, "room-allotment-form.pdf");
}

export function openRoomAllotmentForm() {
  return openForm(roomAllotmentFormPath);
}

export function getReAdmissionFormSource() {
  return getFormSource(reAdmissionFormPath);
}

export function downloadReAdmissionForm() {
  return downloadForm(reAdmissionFormPath, "re-admission-form.pdf");
}

export function openReAdmissionForm() {
  return openForm(reAdmissionFormPath);
}