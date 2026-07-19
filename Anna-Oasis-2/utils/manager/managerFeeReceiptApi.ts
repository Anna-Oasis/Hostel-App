import api from "@/api";
import { getToken } from "../authUtils";
import { Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { Buffer } from "buffer";

export async function downloadFeeReceipt(admissionId : string, roll_number : string) {
    const token = await getToken();

    if (!token) {
        throw new Error("No authentication token found");
    }

    try {
        const response = await api.get(
            `/api/manager/forms/feeReceipt/${admissionId}`,
            {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const base64 = Buffer.from(response.data).toString("base64");

        const fileName = `${roll_number}-fee-receipt.pdf`;

  
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], { type: "application/pdf" });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);

        return;
        
    } catch (error) {
        console.error(error);
        window.alert("Error\nFailed to download. Please try again.");
    }
}