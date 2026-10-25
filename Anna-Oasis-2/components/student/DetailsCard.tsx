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
            <Text className='text-2xl underline font-semibold'>INTERNATIONAL HOSTELS ID Card</Text>
            {details?.passportPhotoUrl && (
               <View className="flex-row justify-center gap-4 mt-4">
                    <Image
                        source={{ uri: details.passportPhotoUrl }}
                        className="flex-1 h-[250px] rounded-xl border-2 border-gray-300"
                        resizeMode="cover"
                    />

                    {/* <Image
                        source={{ uri: details.passportPhotoUrl }}
                        className="flex-1 h-[200px] rounded-xl border-2 border-gray-300"
                        resizeMode="cover"
                    /> */}
                </View>
            )}
            <View className="flex-col">
                <View className="mt-2 gap-y-2">
                    <Text className="text-gray-700">
                        <Text className="text-lg font-bold text-[#022B60]">Name: </Text>
                        <Text className="text-lg font-semibold text-primary-800">{details.name || '-'}</Text>
                    </Text>

                    <Text className="text-gray-700">
                        <Text className="text-lg font-bold text-[#022B60]">Roll No: </Text>
                        <Text className="text-lg font-bold text-primary-800">{details.rollNo || '-'}</Text>
                    </Text>

                    <Text className="text-gray-700">
                        <Text className="text-lg font-bold text-[#022B60]">Course: </Text>
                        <Text className="text-lg font-semibold text-primary-800">{details.course || '-'}</Text>
                    </Text>

                    <Text className="text-gray-700">
                        <Text className="text-lg font-bold text-[#022B60]">Branch: </Text>
                        <Text className="text-lg font-semibold text-primary-800">{details.branch || '-'}</Text>
                    </Text>

                    <View className='w-full h-px bg-[#022B60]'/>

                    <Text className="text-gray-700">
                        <Text className="text-lg font-bold text-[#022B60]">Hostel Block: </Text>
                        <Text className="text-lg font-semibold text-primary-800">{details.hostelBlock || '-'}</Text>
                    </Text>

                    <Text className="text-gray-700">
                        <Text className="text-lg font-bold text-[#022B60]">Floor: </Text>
                        <Text className="text-lg font-semibold text-primary-800">{details.floor}</Text>
                    </Text>

                    <Text className="text-gray-700">
                        <Text className="text-lg font-bold text-[#022B60]">Room Number: </Text>
                        <Text className="text-lg font-bold text-primary-800">{details.roomNumber || '-'}</Text>
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default DetailsCard