import api from "@/api";
import { getToken } from "../authUtils";

const applicationFormPath = "/api/student/forms/application-form";
const roomAllotmentFormPath = "/api/student/forms/room-allotment-form";
const reAdmissionFormPath = "/api/student/forms/re-admission-form";

/**
 * Web has no native WebView/FileSystem, and an <iframe src> can't carry a
 * custom Authorization header, so the PDF is fetched as a blob in JS (where
 * we can attach the header) and handed to the browser as an object URL —
 * both for inline preview and for triggering a real download.
 */
async function fetchFormBlob(path: string): Promise<Blob> {
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

  return response.data as Blob;
}

async function getFormPreviewUrl(path: string): Promise<string> {
  const blob = await fetchFormBlob(path);
  return URL.createObjectURL(blob);
}

async function downloadForm(path: string, fileName: string): Promise<void> {
  const blob = await fetchFormBlob(path);
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(objectUrl);
}

export function getApplicationFormSource() {
  return getFormPreviewUrl(applicationFormPath);
}

export function downloadApplicationForm() {
  return downloadForm(applicationFormPath, "application-form.pdf");
}

export function getRoomAllotmentFormSource() {
  return getFormPreviewUrl(roomAllotmentFormPath);
}

export function downloadRoomAllotmentForm() {
  return downloadForm(roomAllotmentFormPath, "room-allotment-form.pdf");
}

export function getReAdmissionFormSource() {
  return getFormPreviewUrl(reAdmissionFormPath);
}

export function downloadReAdmissionForm() {
  return downloadForm(reAdmissionFormPath, "re-admission-form.pdf");
}
