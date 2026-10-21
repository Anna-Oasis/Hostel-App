import { View, Image } from 'react-native'
import { Text } from '@/components/ui/text'
import useUserStore from '@/stores/userStore'

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
        <View className="w-full mb-4 min-h-[100px] bg-white rounded-xl shadow p-4 gap-4 flex-col items-center">
            <Text className='text-2xl underline font-semibold'>Hostel ID Card</Text>
            {details?.passportPhotoUrl && (
                <Image
                    source={{ uri: details.passportPhotoUrl }}
                    style={{ width: 200, height: 250, borderRadius : 10, borderWidth : 2 }}
                />
            )}
            <View className="flex-1 flex-col">
                <View className="mt-2">
                    <Text className="font-semibold text-xl text-gray-700">Name: {details.name || '-'}</Text>
                    <Text className="font-semibold text-xl text-gray-700">Roll No: {details.rollNo || '-'}</Text>
                    <Text className="font-semibold text-xl text-gray-700">Course: {details.course || '-'}</Text>
                    <Text className="font-semibold text-xl text-gray-700">Branch: {details.branch || '-'}</Text>
                    <Text className="font-semibold text-xl text-gray-700">Hostel Block: {details.hostelBlock || '-'}</Text>
                    <Text className="font-semibold text-xl text-gray-700">Floor: {details.floor || '-'}</Text>
                    <Text className="font-semibold text-xl text-gray-700">Room Number: {details.roomNumber || '-'}</Text>

                </View>
            </View>
        </View>
    )
}

export default DetailsCard