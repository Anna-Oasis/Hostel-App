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

export const getStudentVacations = async (): Promise<VacationFormResponse> => {
    const token = await getToken();
    console.log("Token:", token);

    if (!token) {
        throw new Error("No authentication token found");
    }
    const response = await api.get("/api/resident_counsellor/summer_vacation", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = response.data;
    return data as VacationFormResponse;
};

export interface UpdateVacationStatusResponse {
    success: boolean;
    message: string;
}
export const updateVacationStatus = async (id: number, status: boolean, comment?: string): Promise<UpdateVacationStatusResponse> => {
    const token = await getToken();
    console.log("Token:", token);

    if (!token) {
        throw new Error("No authentication token found");
    }
    const response = await api.put(`/api/resident_counsellor/summer_vacation/${id}`,
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