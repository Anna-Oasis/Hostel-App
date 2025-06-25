import api from "@/api";
import { RCLeaveResponse } from "../rc/rcApi";
import { getToken } from "../authUtils";

export async function getRCLeavebyDw(): Promise<RCLeaveResponse> {
    const token = await getToken();
    try {
        const response = await api.get("/api/deputy_warden/rc/leave", {
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
export async function updateRCLeaveStatusByDw(id: number, status: string, comment?: string): Promise<{ success: boolean; message: string }> {
    const token = await getToken();
    try {
        const response = await api.put(`/api/deputy_warden/rc/leave/${id}`, 
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