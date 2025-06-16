import { View, Text, Image } from 'react-native'
import React from 'react'
import SelectField from '@/components/form/SelectField'
import TextField from '@/components/form/TextField'
import { hostelBlocks, admissionCategories, messPreferences, previousResidentOptions } from '@/constants/admission'

const HOSTEL_FEES = [
  { label: "Admission Fee", amount: "₹2,000" },
  { label: "Hostel Rent (per semester)", amount: "₹15,000" },
  { label: "Mess Advance", amount: "₹12,000" },
  { label: "Caution Deposit (Refundable)", amount: "₹5,000" },
];

const UPI_ID = "salaikowshikan531@okicici";
const QR_IMAGE = require("@/assets/images/upi.jpg");

const AdmissionDetails = () => {
  return (
    <View>
      <SelectField label="Hostel Block" value="hostelBlock" options={hostelBlocks} />
      <SelectField label="Mess Preference" value="messPreference" options={messPreferences} />
      <SelectField label="Previous Resident" value="previousResident" options={previousResidentOptions} />
      <SelectField label="Admission Category" value="admissionCategory" options={admissionCategories} />

      <Text className="text-xl font-bold mb-2" style={{marginTop: 24}}>Hostel Fee Payment</Text>
      <View className="items-center mb-4">
        <Image
          source={QR_IMAGE}
          style={{ width: 200, height: 200, marginBottom: 8 }}
          resizeMode="contain"
        />
        <Text className="text-base font-medium">UPI ID: {UPI_ID}</Text>
      </View>
      <View className="mb-4">
        <Text className="text-lg font-semibold mb-2">Fee Structure</Text>
        {HOSTEL_FEES.map((fee, idx) => (
          <View key={idx} className="flex-row justify-between mb-1">
            <Text>{fee.label}</Text>
            <Text>{fee.amount}</Text>
          </View>
        ))}
      </View>
      <Text className="mb-2">
        Please scan the QR code above or use the UPI ID to pay the total hostel fees via Google Pay (GPay).
      </Text>
      <Text className="mb-1 font-medium">After payment, enter your Transaction ID below to proceed.</Text>
      <TextField
        label="Transaction ID"
        value="transactionId"
        placeholder="Enter your Transaction ID"
      />
    </View>
  )
}

export default AdmissionDetails