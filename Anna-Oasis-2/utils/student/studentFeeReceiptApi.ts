import api from "@/api";
import { getToken } from "../authUtils";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Buffer } from "buffer";

function feeReceiptPath(admissionId: string | number) {
  return `/api/student/forms/fee-receipt/${admissionId}`;
}

export async function getFeeReceiptSource(admissionId: string | number) {
  const token = await getToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const baseUrl = api.defaults.baseURL;
  if (!baseUrl) {
    throw new Error("API URL is not configured");
  }

  return {
    uri: `${baseUrl}${feeReceiptPath(admissionId)}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function downloadFeeReceipt(admissionId: string | number) {
  const token = await getToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await api.get(feeReceiptPath(admissionId), {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const base64 = Buffer.from(response.data).toString("base64");
  const fileUri = `${FileSystem.documentDirectory}fee-receipt.pdf`;

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: "base64",
  });

  await Sharing.shareAsync(fileUri, {
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
    dialogTitle: "Open Fee Receipt",
  });

  return fileUri;
}
