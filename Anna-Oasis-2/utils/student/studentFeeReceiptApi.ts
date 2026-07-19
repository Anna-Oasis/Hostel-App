import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Buffer } from "buffer";

export async function downloadFeeReceipt(admissionId : string){
    const token = await getToken()
    if (!token) {
        throw new Error("No authentication token found");
    }
    try {
        const response = await api.get(
            `/api/student/forms/feeReceipt/${admissionId}`,
            {
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
            }},
        )

        const base64 = Buffer.from(response.data).toString("base64");

        const fileUri = FileSystem.cacheDirectory + "fee-receipt.pdf";

        await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: "base64",
        });

        await Sharing.shareAsync(fileUri, {
            mimeType: "application/pdf",
            UTI: "com.adobe.pdf",
            dialogTitle: "Open Fee Receipt",
        });
    } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to download. Please try again.");
    }
}