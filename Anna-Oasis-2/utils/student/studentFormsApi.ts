import api from "@/api";
import { getToken } from "../authUtils";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Buffer } from "buffer";
import { Alert } from "react-native";

const applicationFormPath = "/api/student/forms/application-form";
const roomAllotmentFormPath = "/api/student/forms/room-allotment-form";
const reAdmissionFormPath = "/api/student/forms/re-admission-form";

async function getFormSource(path: string) {
  try{
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const baseUrl = api.defaults.baseURL;
    if (!baseUrl) {
      throw new Error("API URL is not configured");
    }

    return {
      uri: `${baseUrl}${path}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  catch(err : any){
    Alert.alert("Error", "Failed to open form" + err.message)
  }
}

async function downloadForm(path: string, fileName: string, dialogTitle: string) {
  try{
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await api.get(path, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const base64 = Buffer.from(response.data).toString("base64");
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: "base64",
    });

    await Sharing.shareAsync(fileUri, {
      mimeType: "application/pdf",
      UTI: "com.adobe.pdf",
      dialogTitle,
    });

    return fileUri;
  }
  catch(err : any){
    Alert.alert("Error", "Failed to download form" + err.message)
  }
}

export function getApplicationFormSource() {
  return getFormSource(applicationFormPath);
}

export function downloadApplicationForm() {
  return downloadForm(
    applicationFormPath,
    "application-form.pdf",
    "Open Application Form"
  );
}

export function getRoomAllotmentFormSource() {
  return getFormSource(roomAllotmentFormPath);
}

export function downloadRoomAllotmentForm() {
  return downloadForm(
    roomAllotmentFormPath,
    "room-allotment-form.pdf",
    "Open Room Allotment Form"
  );
}

export function getReAdmissionFormSource() {
  return getFormSource(reAdmissionFormPath);
}

export function downloadReAdmissionForm() {
  return downloadForm(
    reAdmissionFormPath,
    "re-admission-form.pdf",
    "Open Re-Admission Form"
  );
}