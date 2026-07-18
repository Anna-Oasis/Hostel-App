import api from "@/api";
import { getToken } from "@/utils/authUtils";
import { Alert } from "react-native";

export async function updateStudentRoom(values : any) {
    try{
        const token = await getToken()
        if(!token) throw new Error("You are not logged in. Please Login")

        const res = await api.post("/api/resident_counsellor/room-change", values,{
            headers : {Authorization : `Bearer ${token}`}
        })

        if (!res.data?.success) throw new Error(res.data?.message || "Failed to update room");
        Alert.alert("Success", res.data.message)
    }
    catch (err: any) {
           const message =
        err.response?.data?.message || // Backend message
        err.message ||                 // Axios/network message
        "Something went wrong";
            Alert.alert("OOPS", message)
        throw new Error(err.message || "Failed to fetch applications");
    }
}