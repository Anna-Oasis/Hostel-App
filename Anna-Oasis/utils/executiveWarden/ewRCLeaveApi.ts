import api from "@/api";
import { getToken } from "../authUtils";

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

export async function getRCLeavebyEw(): Promise<RCLeaveResponse> {
    const token = await getToken();
    try {
        const response = await api.get("/api/executive_warden/rc/leave", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
        const data = response.data;
        return data as RCLeaveResponse;
    } catch (error) {
        console.error("Error fetching RC leaves:", error);
        throw new Error("Failed to fetch RC leaves");
    }
}
export async function updateRCLeaveStatusByEw(id: number, status: string, comment?: string): Promise<{ success: boolean; message: string }> {
    const token = await getToken();
    try {
        const response = await api.put(`/api/executive_warden/rc/leave/${id}`, 
            { status: status, comment: comment || "" }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating RC leave status:", error);
        throw new Error("Failed to update RC leave status");
    }
}