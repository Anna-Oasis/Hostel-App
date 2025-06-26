import api from "@/api";
import { getToken } from "../authUtils";
import { Alert } from "react-native";
import { router } from "expo-router";

export interface VacationFormResponse {
    success: boolean;
    message: string;
    data: VacationForm[];
}

export interface VacationForm {
    id: number;
    floor: number;
    block: string;
    room_number: number;
    roll_number: string;
    vacation_from: string;
    address_of_stay: string;
    returned_items: string[];
    status: string;
    created_at: string;
    updated_at: string;
    student_name: string;
}

export interface UpdateVacationStatusResponse {
    success: boolean;
    message: string;
}

export interface UpdateVacationStatusResponse {
    success: boolean;
    message: string;
}
export const updateVacationStatusByDw = async (id: number, status: boolean, comment?: string): Promise<UpdateVacationStatusResponse> => {
    const token = await getToken();
    console.log("Token:", token);

    if (!token) {
        throw new Error("No authentication token found");
    }
    const response = await api.put(`/api/deputy_warden/summer_vacation/${id}`,
        { approve: status, comment: comment || "" },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    const data = response.data;
    return data as UpdateVacationStatusResponse;
}

export interface RCLeaveResponse {
    message: string;
    success: boolean;
    data: RCLeave[];
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

export interface RCLeaveResponseWithMsg {
    success: boolean;
    data: RCLeave[];
    message: string;
}

export const getRCLeavesbyDW = async (): Promise<RCLeaveResponse> => {
    const token = await getToken();
    console.log("Token:", token);

    if (!token) {
        throw new Error("No authentication token found");
    }
    const response = await api.get("/api/deputy_warden/rc/leave", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = response.data;
    return data as RCLeaveResponse;
}

export interface RCListResponse {
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

export interface RCLeaveCompleteResponse {
    success: boolean;
    message: string;
    data: RCInfo[];
}


export const getRCList = async (): Promise<RCListResponse> => {
    const token = await getToken();
    console.log("Token:", token);

    if (!token) {
        throw new Error("No authentication token found");
    }
    const response = await api.get("/api/resident_counsellor/list", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = response.data;
    return data as RCListResponse;
}

export const approveRCLeave = async (id: number, status: string, comment?: string): Promise<RCLeaveCompleteResponse> => {
    const token = await getToken();
    console.log("Token:", token);

    if (!token) {
        throw new Error("No authentication token found");
    }
    const response = await api.put(`/api/deputy_warden/rc/leave/${id}`,
        { approve: status },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    const data = response.data;
    return data as RCLeaveCompleteResponse;
}