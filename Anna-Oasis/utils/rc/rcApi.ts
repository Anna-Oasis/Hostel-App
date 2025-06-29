import api from "@/api";
import { getToken } from "../authUtils";
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
