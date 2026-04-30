import { View, Image } from 'react-native'
import { Text } from '@/components/ui/text'
import { router } from 'expo-router'
import { Button, ButtonIcon } from '@/components/ui/button'
import { Pencil } from 'lucide-react-native'
import useUserStore from '@/stores/userStore'
import { useEffect } from 'react'

const DetailsCard = () => {
    const details = useUserStore((state) => state.details);

    if (!details) {
        return (
            <View className="w-full mb-4 min-h-[100px] bg-white rounded-xl shadow p-4 flex-row items-center justify-center">
                <Text className="text-base text-gray-700">Please fill your details first</Text>
            </View>
        );
    }

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
                <View className="mt-2">
                    <Text className="text-base text-gray-700">Roll No: {details.rollNo || '-'}</Text>
                    <Text className="text-base text-gray-700">Course: {details.course || '-'}</Text>
                    <Text className="text-base text-gray-700">Branch: {details.branch || '-'}</Text>
                </View>
            </View>
        </View>
    )
}

export default DetailsCard