import api from "@/api"


export const handleGrievance = async (values: {
  title: string;
  category: string;
  description: string;
}) => {
  const { title, category, description } = values;

  try {
      const response = await api.post("/api/student/grievance", {
        roll_number: "22CS1002",
        grievance_type: category,
        subject: title,
        description
      });

    return response.data.success;
  } catch (error : any) {
        console.log(`Error :  ${error.message}`);
        return false;
  }

};

export const getHistroyOfGrievance = async () => {
    try {
      const response = await api.get("/api/student/grievance/22CS1002")

      return response.data.data
    } catch (error : any) {
        console.log(`Error :  ${error.message}`);
        return false;
    }
}