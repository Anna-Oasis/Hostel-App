import { Alert, View, Image } from 'react-native'
import { Text } from '@/components/ui/text'
import { useEffect } from 'react'
import { getStudentDetails } from '@/utils/student/studentDetailsApi'
import { router } from 'expo-router'
import useUserStore from '@/stores/userStore'
import { Button, ButtonIcon } from '@/components/ui/button'
import { Pencil } from 'lucide-react-native'

const DetailsCard = () => {
    const setDetails = useUserStore((state) => state.setDetails);
    const details = useUserStore((state) => state.details);

    const fetchDetails = async () => {
        try {
            const details = await getStudentDetails();
            if (!details.success){
                Alert.alert("Personal Details","Please fill your personal details first");
                router.push("/User/Student/Details/Edit");
            } else {
                setDetails(details.data);
            }
            console.log(details.data);
        } catch (error) {
            console.error("Error fetching student details:", error);
        }
    }

    useEffect(()=>{
        if (!details) {
            fetchDetails();
        }
    },[])

    return (
        <View className="w-full mb-4 min-h-[100px] bg-white rounded-xl shadow p-4 flex-row items-start">
            {details?.passportPhotoUrl ? (
                <Image
                    source={{ uri: details.passportPhotoUrl }}
                    style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16 }}
                />
            ) : (
                <View style={{ width: 64, height: 64, borderRadius: 32, marginRight: 16, backgroundColor: '#e5e7eb' }} />
            )}
            <View className="flex-1 flex-col">
                <View className="flex-row justify-between items-start">
                    <Text className="text-lg font-semibold text-gray-800">
                        {details?.name || "DetailsCard"}
                    </Text>
                    <Button
                        size="sm"
                        onPress={() => router.push("/User/Student/Details/Edit")}
                        style={{ marginLeft: 8 }}
                    >
                        <ButtonIcon as={Pencil} />
                    </Button>
                </View>
                {details && (
                    <View className="mt-2">
                        <Text className="text-base text-gray-700">Roll No: {details.rollNo || '-'}</Text>
                        <Text className="text-base text-gray-700">Course: {details.course || '-'}</Text>
                        <Text className="text-base text-gray-700">Branch: {details.branch || '-'}</Text>
                    </View>
                )}
            </View>
        </View>
    )
}

export default DetailsCard