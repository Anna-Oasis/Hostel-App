import { View, ScrollView, Image } from 'react-native'
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
    <Box className="flex-1 p-4">
      <ScrollView>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(details).map(([key, value]) => (
              <TableRow key={key}>
                <TableData>{key}</TableData>
                <TableData>
                  {imageFields.includes(key) && typeof value === 'string' && value ? (
                    <Image
                      source={{ uri: value }}
                      style={{ width: 80, height: 80, borderRadius: 8 }}
                      resizeMode="contain"
                    />
                  ) : (
                    value === null || value === undefined || value === "" 
                      ? "not assigned yet"
                      : String(value)
                  )}
                </TableData>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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