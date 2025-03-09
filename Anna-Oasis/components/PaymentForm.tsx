import React from "react";
import { View } from "react-native";
import { useFormikContext } from "formik";
import TextField from "@/components/form/TextField";
import SelectField from "@/components/form/SelectField";

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
    <View>
      <SelectField value="paymentDone" options={Options} />

      {values.paymentDone === "Yes" && (
        <>
          <TextField placeholder="Transaction ID" value="transactionId" />
          <TextField placeholder="Transaction Date" value="transactionDate" />
        </>
      )}
    </View>
  );
}

export default PaymentForm;