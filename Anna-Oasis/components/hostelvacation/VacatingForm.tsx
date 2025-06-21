import React from "react";
import { View, ScrollView } from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import PhoneInputField from "@/components/form/PhoneInputField";
import DatePickerField from "@/components/form/DatePickerField";
import TimePickerField from "@/components/form/TimePickerField";
import CheckBoxField from "@/components/form/CheckBoxField";
import { Button, ButtonText } from "@/components/ui/button";
import { vacatingItems, initialValues } from "@/constants/vacatingHostels";
import { validationSchema } from "@/constants/vacatingHostelValidation";

type VacatingFormValues = typeof initialValues & {
  declarationAccepted: string[];
};

interface VacatingFormProps {
  onNext: (formData: FormData, values: VacatingFormValues) => void;
  initialValues?: VacatingFormValues;
}

export default function VacatingForm({
  onNext,
  initialValues: initialVals,
}: VacatingFormProps) {
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <Formik<VacatingFormValues>
        initialValues={initialVals || initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => {
          const formData = new FormData();
          Object.entries({
            ...values,
            declarationAccepted: values.declarationAccepted.includes("true"),
          }).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              formData.append(key, JSON.stringify(value));
            } else if (typeof value === "boolean") {
              formData.append(key, value ? "true" : "false");
            } else if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
          });
          onNext(formData, values);
        }}
      >
        {({ handleSubmit }) => (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <View className="space-y-4">
              <TextField label="Room No" value="roomNo" placeholder="Enter Room Number" />
              <DatePickerField label="Vacate Date" value="vacateDate" placeholder="YYYY-MM-DD" />
              <TimePickerField label="Vacate Time" value="vacateTime" placeholder="HH:MM" />
              <TextField label="Future Address" value="futureAddress" placeholder="Permanent address" />
              <PhoneInputField label="Student Mobile" value="studentMobile" placeholder="Phone number" />
              <TextField label="Parent's Email" value="parentEmail" placeholder="Parent's Email" />
              <PhoneInputField label="Local Guardian Mobile" value="localGuardianMobile" placeholder="Guardian's Phone number" />

              <CheckBoxField
                label="Did you hand over all the items?"
                value="itemsReturned"
                options={vacatingItems.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />

              <CheckBoxField
                label="I acknowledge that I leave the room without any damages. If any issues are found later, I agree to pay the applicable charges."
                value="declarationAccepted"
                options={[
                  {
                    label: "",
                    value: "true",
                  },
                ]}
              />

              <Button onPress={() => handleSubmit()}>
                <ButtonText>Next</ButtonText>
              </Button>
            </View>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
}