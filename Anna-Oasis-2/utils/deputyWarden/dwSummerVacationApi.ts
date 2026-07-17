import api from "@/api";
import { getToken } from "../authUtils";

// Represents the "summer_vacation" object
export interface SummerVacation {
    id: number;
    roll_number: string;
    vacation_from: string;
    address_of_stay: string;
    returned_items: string[];
    mobile: string;
    email: string;
    status: string;
    created_at: string;
    updated_at: string;
}

// Represents the "student" object
export interface Student {
    user_id: number;
    roomNumber: number;
    floor: number;
    hostelBlock: string;
    name: string;
    rollNo: string;
    course: string;
    branch: string;
    semester: string;
    mobile: string;
    email: string;
    emergencyContact: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    govtIdType: string;
    govtId: string;
    bloodGroup: string;
    medicalHistory: string;
    admissionCategory: string;
    fatherName: string;
    fatherOccupation: string;
    fatherMobile: string;
    fatherEmail: string;
    fatherCountry: string;
    motherName: string;
    motherOccupation: string;
    motherMobile: string;
    motherEmail: string;
    motherCountry: string;
    resIndiaHouseNo: string;
    resIndiaStreet: string;
    resIndiaCity: string;
    resIndiaState: string;
    resIndiaCountry: string;
    resIndiaPostalCode: string;
    resForeignHouseNo: string;
    resForeignStreet: string;
    resForeignCity: string;
    resForeignState: string;
    resForeignCountry: string;
    resForeignPostalCode: string;
    localGuardianName: string;
    localGuardianRelationship: string;
    localGuardianMobile: string;
    localGuardianEmail: string;
    guardianHouseNo: string;
    guardianStreet: string;
    guardianCity: string;
    guardianState: string;
    guardianCountry: string;
    guardianPostalCode: string;
    createdAt: string;
    updatedAt: string;
    approve: boolean;
    comment: string;
    passportPhotoUrl: string;
    studentSignatureUrl: string;
    parentGuardianSignatureUrl: string;
    categoryProofUrl: string;
    admissionSlipUrl: string;
}

// Each VacationForm contains a summer_vacation and a student
export interface VacationForm {
    summer_vacation: SummerVacation;
    student: Student;
}

export interface VacationFormResponse {
    success: boolean;
    message: string;
    data: VacationForm[];
}

export interface UpdateVacationStatusResponse {
    success: boolean;
    message: string;
}

export const getStudentVacationsByDw = async (): Promise<VacationFormResponse> => {
    const token = await getToken();
    console.log("Token:", token);

    if (!token) {
        throw new Error("No authentication token found");
    }
    const response = await api.get("/api/deputy_warden/summer_vacation", {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = response.data;
    return data as VacationFormResponse;
};

export const updateVacationStatusByDw = async (
    id: number,
    status: boolean,
    comment?: string
): Promise<UpdateVacationStatusResponse> => {
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
};