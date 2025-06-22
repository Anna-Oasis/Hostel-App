import { View, ScrollView, Image } from 'react-native'
import React from 'react'
import useUserStore from '@/stores/userStore'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableData } from "@/components/ui/table"
import { Button, ButtonText } from '@/components/ui/button'
import { router } from 'expo-router'

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
    <ScrollView className="flex-1 p-4">
      <Button
        className="mb-4 self-end"
        size="sm"
        onPress={() => router.push('/User/Student/Details/Edit')}
      >
        <ButtonText>Edit Details</ButtonText>
      </Button>
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
                  String(value)
                )}
              </TableData>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollView>
  )
}

export default DetailsPage