import { View, ScrollView, Text } from "react-native";
import TextField from "@/components/form/TextField";
import DatePickerField from "@/components/form/DatePickerField";
import TimePickerField from "@/components/form/TimePickerField";
import CheckBoxField from "@/components/form/CheckBoxField";
import { vacatingItems } from "@/constants/vacatingHostels";
import SelectField from "@/components/form/SelectField";
import MultiLineText from "@/components/form/MultiLineText";

const ENDEAVOUR_OPTIONS = [
  { label: "Higher Studies", value: "HIGHER_STUDIES" },
  { label: "Job", value: "JOB" },
  { label: "Competitive Exams", value: "COMPETITIVE_EXAMS" },
  { label: "Others", value: "OTHERS" },
];

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

export default function VacatingForm() {
  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View className="space-y-4 p-4">
          <DatePickerField
            label="Vacate Date"
            value="vacating_date"
            placeholder="YYYY-MM-DD"
          />
          <TimePickerField
            label="Vacate Time"
            value="vacating_time"
            placeholder="HH:MM"
          />
          <TextField
            label="Future Address"
            value="future_address"
            placeholder="Permanent address"
          />

          <SelectField
            label="Future endeavour"
            value="endeavour"
            options={ENDEAVOUR_OPTIONS}
          />

          <TextField
            label="Endeavour Description"
            value="endeavourDescription"
            placeholder="Describe your endeavour in brief"
          />

          <MultiLineText
            label="Feedback"
            value="feedback"
            placeholder="Share your feedback about the hostel experience"
          />

          <CheckBoxField
            label="Did you hand over all the items?"
            value="returned_items"
            options={vacatingItems.map((item) => ({
              label: item,
              value: item,
            }))}
          />

          <View className="p-2 flex gap-2 justify-center items-center m-4">
            <Text className="text-error-500">
              I acknowledge that I leave the room without any damages. If any
              issues are found later, I agree to pay the applicable charges.
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
        </View>
      </ScrollView>
    </View>
  );
}
