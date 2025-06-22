import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import { useEffect } from 'react'
import { getStudentDetails } from '@/utils/student/studentApi'

const DetailsCard = () => {

    const fetchDetails = async () => {
        try {
            const details = await getStudentDetails();
            console.log("Student Details:", details);
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