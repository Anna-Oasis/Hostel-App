import api from "@/api";
import { getToken } from "../authUtils";

export interface RCLeaveResponse {
    message: string;
    success: boolean;
    data: RCLeave[];
}

export interface RCLeave {
    leave: {
    id: number;
    rc_id: number;
    leaving: string;
    arrival: string;
    reason: string;
    approved: string;
    created_at: string;
    dw_approved_at?: string;
    ew_updated_at?: string;
  };
  rc: {
    id: number;
    userId: number;
    name: string;
    hostel: string;
    onLeave: boolean;
    floor: number[];
    alternatingToRCId: number | null;
    createdAt: string;
    updatedAt: string;
  };
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