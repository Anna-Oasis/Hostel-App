import React from "react";
import { View, ScrollView } from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { initialValues, validationSchema, NOTE } from "@/constants/cautionDepositValidation";

export default function CautionDepositForm({
  onSubmit,
  onBack,
  initialValues: initialVals,
}: {
  onSubmit: (formData: FormData, values: any) => void;
  onBack?: (values: any) => void;
  initialValues?: any;
}) {
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <Formik
        initialValues={initialVals || initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => {
          const formData = new FormData();
          Object.entries(values).forEach(([key, value]) => {
            formData.append(key, value != null ? String(value) : "");
          });
          onSubmit(formData, values);
        }}
      >
        {({ handleSubmit, values }) => (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <View className="space-y-4">
              <TextField
                label="Account Holder Name (Student’s name only)"
                value="accountHolderName"
                placeholder="Enter Account Holder Name"
              />
              <TextField
                label="Account Number"
                value="accountNumber"
                placeholder="Enter Account Number"
              />
              <TextField
                label="Bank Name (in Full)"
                value="bankName"
                placeholder="Example: State Bank of India"
              />
              <TextField
                label="Address of the bank"
                value="bankAddress"
                placeholder="Enter Bank Address"
              />
              <TextField
                label="IFS Code"
                value="ifscCode"
                placeholder="Enter IFS Code"
              />

              <View className="bg-gray-100 rounded-md p-3 mt-2">
                <Text className="text-xs text-gray-700 font-medium mb-1">Note:</Text>
                <Text className="text-xs text-gray-700">{NOTE}</Text>
              </View>

              <Button className="mt-4" onPress={() => handleSubmit()}>
                <ButtonText>Submit</ButtonText>
              </Button>
              {onBack && (
                <Button className="mt-2 bg-gray-200" onPress={() => onBack(values)}>
                  <ButtonText className="text-gray-800">Back</ButtonText>
                </Button>
              )}
            </View>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
}