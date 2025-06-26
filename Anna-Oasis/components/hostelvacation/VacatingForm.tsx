import React from "react";
import { View, ScrollView, Text } from "react-native";
import { useFormikContext } from "formik";
import TextField from "@/components/form/TextField";
import DatePickerField from "@/components/form/DatePickerField";
import TimePickerField from "@/components/form/TimePickerField";
import CheckBoxField from "@/components/form/CheckBoxField";
import { Button, ButtonText } from "@/components/ui/button";
import { vacatingItems } from "@/constants/vacatingHostels";

type VacatingFormValues = {
  vacateDate: string;
  vacateTime: string;
  futureAddress: string;
  itemsReturned: string[];
  declarationAccepted: string[];
};

interface VacatingFormProps {
  onNext: () => void;
}

export default function VacatingForm({ onNext }: VacatingFormProps) {
  const { handleSubmit } = useFormikContext<VacatingFormValues>();

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="space-y-4 p-4">
          <DatePickerField
            label="Vacate Date"
            value="vacateDate"
            placeholder="YYYY-MM-DD"
          />
          <TimePickerField
            label="Vacate Time"
            value="vacateTime"
            placeholder="HH:MM"
          />
          <TextField
            label="Future Address"
            value="futureAddress"
            placeholder="Permanent address"
          />

          <CheckBoxField
            label="Did you hand over all the items?"
            value="itemsReturned"
            options={vacatingItems.map((item) => ({
              label: item,
              value: item,
            }))}
          />

          <View className="p-2 flex gap-2 justify-center items-center m-4">
            <Text className="text-error-500">
              I acknowledge that I leave the room without any damages. If
              any issues are found later, I agree to pay the applicable
              charges.
            </Text>
            <CheckBoxField
              value="declarationAccepted"
              options={[
                {
                  label: "I accept the hostel terms and condition",
                  value: "true",
                },
              ]}
            />
          </View>

          <Button onPress={onNext}>
            <ButtonText>Next</ButtonText>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

