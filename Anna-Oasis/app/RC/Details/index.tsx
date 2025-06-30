import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Box } from '@/components/ui/box';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text,Image } from 'react-native';
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab"
import { Pencil } from 'lucide-react-native'
import { useRouter } from 'expo-router';
import api from '@/api';

const RCDetailsViewPage = () => {

    const rc_detials = {
    "user_id": "rc_user_1234",
    "name": "jhon doe",
    "dept": "Information Technology",
    "register_no": "2023IT101",
    "dob": "2005-08-15",
    "mobile": "+91-9876543210",
    "email": "jhon@example.com",
    "guardian_name": "Arun Kumar",
    "residential_address": "123, Anna Nagar, Chennai, Tamil Nadu, 600040",
    "blood_group": "O+",
    "medical_history": "None",
    "passportPhotoUrl": "https://example.com/uploads/passport_photo.jpg",
    "rcSignatureUrl": "https://example.com/uploads/rc_signature.png"
    }
    const imageFields = [
        "passportPhotoUrl",
        "rcSignatureUrl"
    ]


    function formatKey(key: string) {
        return key
            .replace(/_/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    const router = useRouter()

    return (
        <Box>
            <ScrollView contentContainerStyle={{padding : 8}}>
                <View className="bg-white rounded-xl shadow-sm mb-4 p-2">
                    <Table className='w-full'>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="py-2 font-bold text-base">Field</TableHead>
                                <TableHead className="py-2 font-bold text-base">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.entries(rc_detials).map(([key, value], idx) => (
                                <TableRow key={idx}>
                                    <TableData className="py-2">
                                        <Text className="font-bold text-gray-800">{formatKey(key)}</Text>
                                    </TableData>
                                    <TableData className="py-2">
                                        {imageFields.includes(key) && typeof value === 'string' && value ? (
                                            <Image
                                            source={{ uri: value }}
                                            className="w-20 h-20 rounded-lg my-1"
                                            resizeMode="contain"
                                            />
                                        ) : (
                                            <Text className={value === null || value === undefined || value === "" ? "text-gray-400" : "text-gray-800"}>
                                            {value === null || value === undefined || value === ""
                                                ? "not assigned yet"
                                                : String(value)}
                                            </Text>
                                        )}
                                    </TableData>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </View>
            </ScrollView>
            <Fab
                size="md"
                placement="bottom right"
                isHovered={false}
                isDisabled={false}
                isPressed={false}
                onPress={() => router.push('/RC/Details/Edit')}
            >
                <FabIcon as={Pencil} />
                <FabLabel>Edit Details</FabLabel>
            </Fab>
        </Box>
    );
}


export default RCDetailsViewPage;
