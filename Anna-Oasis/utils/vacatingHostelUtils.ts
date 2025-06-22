import api from "@/api";
import { getToken } from "./authUtils";

export const submitStudentVacatingForm = async(vacatingValues : any, cautionDepositValues : any) => {
  
    try {
        const reqBody = {
          vacatingForm: {
            roll_number: "2025115002",
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

    console.log(reqBody)
    console.log(cautionDepositValues)


        const tok = await getToken()

        const response = await api.post("/api/student/vacating_hostel", reqBody, {
          headers : {
            Authorization : `Bearer ${tok}`
          }
        })

        return response.data.success
    } catch (error : any) {
        console.log(`Error :  ${error}`);
        return false;
    }
}

export const getVacatingHistroy = async() => {
  try {
        const tok = await getToken()
        const res = await api.get("/api/student/vacating_hostel/2025115002",  {
          headers : {
            Authorization : `Bearer ${tok}`
          }
        })

    return res.data.data
  } catch (error) {
    console.log(`Error :  ${error}`);
        return false; 
  }
}