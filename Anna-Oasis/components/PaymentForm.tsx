import React from "react";
import { View,Text } from "react-native";
import { useFormikContext } from "formik";
import TextField from "@/components/form/TextField";
import RadioField from "@/components/form/RadioField";
import DatePicker from "@/components/form/DatePicker";
// <DatePickerField placeholder="Transaction Date" value="transactionDate" />

const Options = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

interface FormValues {
  paymentDone: string;
  transactionId?: string;
  transactionDate?: string;
}

function PaymentForm() {
  const { values } = useFormikContext<FormValues>();

  return (
    <View className="p-4">
      <Text className="text-lg font-semibold text-primary-300"> 
        Have you paid the fee? 
      </Text>
      <RadioField value="paymentDone" options={Options} />

      <Text className="text-lg font-semibold text-primary-300"> 
        Any Dues ?
      </Text>
      <RadioField value="dues" options={Options} />

      {values.paymentDone === "Yes" && (
        <>
          <TextField placeholder="Transaction ID" value="transactionId" />
          <TextField placeholder="Transaction Date" value="transactionDate" />
          <TextField placeholder="Amount" value="amount"/>
        </>
      )}
    </View>
  );
}

export default PaymentForm;