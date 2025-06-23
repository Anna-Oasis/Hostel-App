import { View, ScrollView, Image, Text } from 'react-native'
import React from 'react'
import useUserStore from '@/stores/userStore'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableData } from "@/components/ui/table"
import { router } from 'expo-router'
import { Box } from "@/components/ui/box"
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab"
import { Pencil } from 'lucide-react-native'

const imageFields = [
  "passportPhotoUrl",
  "studentSignatureUrl",
  "parentGuardianSignatureUrl",
  "categoryProofUrl",
  "admissionSlipUrl"
]

function formatKey(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

const DetailsPage = () => {
  const details = useUserStore((state) => state.details)

  if (!details) {
    return (
      <View className="flex-1 items-center justify-center">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>No Details Found</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </View>
    )
  }

  return (
    <Box className="flex-1 p-2">
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        <View className="bg-white rounded-xl shadow-sm mb-4 p-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="py-2 font-bold text-base">Field</TableHead>
                <TableHead className="py-2 font-bold text-base">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(details).map(([key, value], idx) => (
                <TableRow
                  key={key}
                  className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}
                >
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
        onPress={() => router.push('/User/Student/Details/Edit')}
      >
        <FabIcon as={Pencil} />
        <FabLabel>Edit Details</FabLabel>
      </Fab>
    </Box>
  )
}

export default DetailsPage