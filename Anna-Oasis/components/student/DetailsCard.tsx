import { Alert, View } from 'react-native'
import { Text } from '@/components/ui/text'
import { useEffect } from 'react'
import { getStudentDetails } from '@/utils/student/studentApi'
import { router } from 'expo-router'

const DetailsCard = () => {

    const fetchDetails = async () => {
        try {
            const details = await getStudentDetails();
            if (!details.success){
                console.log("Failed to fetch student details:", details.message);
                Alert.alert("Personal Details","Please fill your personal details first");
                router.push("/User/Student/Details");
            }
        } catch (error) {
            console.error("Error fetching student details:", error);
        }
    }
    useEffect(()=>{
        fetchDetails();
    },[])

  return (
    <View className="w-full mb-4 min-h-[100px] bg-white rounded-xl shadow p-4 flex-row items-center">
      <Text className="text-lg font-semibold text-gray-800">DetailsCard</Text>
    </View>
  )
}

export default DetailsCard