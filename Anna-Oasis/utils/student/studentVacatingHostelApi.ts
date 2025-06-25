import api from "@/api";
import { getToken } from "@/utils/authUtils";


export const submitStudentVacatingForm = async(roll_number : string, vacatingValues : any, cautionDepositValues : any) => {
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
            vacating_date: vacatingValues.vacateDate,
            vacating_time: vacatingValues.vacateTime + ':00',
            future_address: vacatingValues.futureAddress,
            returned_items: vacatingValues.itemsReturned,
          },
          cautionDeposit: {
            accountHolderName: cautionDepositValues.accountHolderName,
            accountNumber: cautionDepositValues.accountNumber,
            bankName: cautionDepositValues.bankName,
            addressOfTheBank: cautionDepositValues.bankAddress,
            IFSCode: cautionDepositValues.ifscCode,
          },
        };

        const token = await getToken()
        console.log("Submitting vacating form with data:", reqBody);

        const response = await api.post("/api/student/vacating_hostel", reqBody, {
          headers : {
            Authorization : `Bearer ${token}`
          }
        })

        return response.data.success
    } catch (error : any) {
        console.log(`Error :  ${error}`);
        return false;
    }
}

export const getVacatingHistory = async() => {
  try {
        const token = await getToken()
        const res = await api.get(`/api/student/vacating_hostel/`,  {
          headers : {
            Authorization : `Bearer ${token}`
          }
        })
    return res.data.data
  } catch (error) {
    console.log(`Error :  ${error}`);
        return false; 
  }
}