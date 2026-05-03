import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";
import { router } from "expo-router";

export interface RCLeaveCompleteResponse {
    success: boolean;
    message: string;
    data: RCInfo[];
}

export interface RCInfo {
    id: number;
    userId: number;
    name: string;
    hostel: string;
    onLeave: boolean;
    floor: number[]; // Can be empty or contain floor numbers like [1, 2, 3]
    alternatingToRCId: number | null;
    createdAt: string; // ISO timestamp
    updatedAt: string; // ISO timestamp
}

export interface RCLeaveFormPayload {
    rc_id: number;
    arrival: string;   // ISO date string (e.g., "2025-01-03")
    leaving: string;   // ISO date string
    reason: string;
    alternate: number; // Alternate RC ID
}

export interface CreateRCLeaveResponse {
    success: boolean;
    message: string;
    data: RCLeave[];
    updatedRc: RCInfo[];
}

export interface RCLeave {
    id: number;
    rc_id: number;
    leaving: string;         // ISO Date string (e.g., "2025-01-03")
    arrival: string;         // ISO Date string
    reason: string;
    approved: string;        // Likely a string enum: "0" | "1" | "2" | "-1"
    created_at: string;      // ISO timestamp
    dw_approved_at: string;  // ISO timestamp
    ew_updated_at: string;   // ISO timestamp
}


export const completeRCLeave = async () => {
    const token = await getToken();
    console.log("Token:", token);

    if (!token) {
        throw new Error("No authentication token found");
    }
    const response = await api.post("/api/resident_counsellor/leave/complete", {},{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = response.data;
    return data as RCLeaveCompleteResponse;
}

export const submitRCLeaveForm = async (payload: RCLeaveFormPayload) => {
    const token = await getToken();
    console.log("Token:", token);

    if (!token) {
        throw new Error("No authentication token found");
    }
    const response = await api.post("/api/resident_counsellor/leave", payload, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = response.data as CreateRCLeaveResponse;
    if (data.success) {
        console.log('RC Leave Form submitted successfully:', data);
        Alert.alert("Success", "RC Leave Form submitted successfully");
        router.replace("/RC");
    } else {
        console.error('Failed to submit RC Leave Form:', data.message);
    }
    return data;
}

export const getRCLeaves = async (): Promise<RCLeaveResponseWithMsg> => {
    const token = await getToken();
    console.log("Token:", token);
    if (!token) {
        throw new Error("No authentication token found");
    }
    const response = await api.get("/api/resident_counsellor/leave", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = response.data;
    return data as RCLeaveResponseWithMsg;
}

export interface RCLeaveResponseWithMsg {
    success: boolean;
    data: RCLeave[];
    message: string;
}