import api from "@/api";
import { getToken } from "@/utils/authUtils";
import { Alert } from "react-native";

export const submitStudentVacatingForm = async (
  roll_number: string,
  vacatingValues: any,
  cautionDepositValues: any
) => {
  try {
    if (!roll_number) {
      console.error("User details not found or roll number is missing.");
      return false;
    }

    if (!vacatingValues || !cautionDepositValues) {
      console.error("Vacating values or caution deposit values are missing.");
      return false;
    }
    const reqBody = {
      vacatingForm: {
        roll_number: roll_number,
        vacating_date: vacatingValues.vacating_date,
        vacating_time: vacatingValues.vacating_time,
        future_address: vacatingValues.future_address,
        returned_items: vacatingValues.returned_items,
        endeavour: vacatingValues.endeavour,
        endeavourDescription: vacatingValues.endeavourDescription,
        feedback: vacatingValues.feedback,
      },
      cautionDeposit: cautionDepositValues,
    };

    const token = await getToken();
    console.log("Submitting vacating form with data:", reqBody);

    const response = await api.post("/api/student/vacating_hostel", reqBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.success;
  } catch (error: any) {
    Alert.alert(
      "Error",
      "An error occurred while submitting the vacating form. Please try again later."
    );
    console.log(`Error :  ${error}`);
    return false;
  }
};

export const getVacatingHistory = async () => {
  try {
    const token = await getToken();
    const res = await api.get(`/api/student/vacating_hostel/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  } catch (error) {
    console.log(`Error :  ${error}`);
    return false;
  }
};
