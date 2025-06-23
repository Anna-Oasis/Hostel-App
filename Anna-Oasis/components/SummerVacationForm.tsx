// components/SummerVacationForm.tsx
import CheckBoxField from "@/components/form/CheckBoxField";
import DatePickerField from "@/components/form/DatePickerField";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Formik } from "formik";
import { ScrollView, View, Text, KeyboardAvoidingView, Platform } from "react-native";
import * as Yup from "yup";
import TimePickerField from "@/components/form/TimePickerField";
import { submitSummerVacationRequest } from "@/utils/student/studentVacationApi";

export default function SummerVacationForm() {
  const hostelItemsOptions = [
    { label: "AC Remote", value: "AC Remote" },
    { label: "Room Keys", value: "Room Keys" },
    { label: "Lan Cable", value: "Lan Cable" },
    { label: "Cupboard Keys", value: "Cupboard Keys" },
  ];

  const summerVacationSchema = Yup.object().shape({
    vacationDate: Yup.string().required("Date of vacate is required"),
    vacationTime: Yup.string().required("Time of vacate is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string().email("Enter a valid email").required("Parent's email is required"),
    hostelItems: Yup.array().min(1).required(),
    declaration: Yup.array().min(1).required(),
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-4 items-center">
          <Text className="text-2xl font-normal mb-2">Summer Vacation Form</Text>

          <Formik
            initialValues={{
              vacationDate: "",
              vacationTime: "",
              address: "",
              email: "",
              hostelItems: [],
              declaration: [],
            }}
            validationSchema={summerVacationSchema}
            onSubmit={(values) => {
              submitSummerVacationRequest({
                vacation_from: values.vacationDate,
                vacation_time: values.vacationTime,
                address_of_stay: values.address,
                returned_items: values.hostelItems,
              });
            }}
          >
            {({ handleSubmit }) => (
              <View className="space-y-4">
                <DatePickerField minimumDate={new Date()} value="vacationDate" label="Date of vacate" />
                <TimePickerField value="vacationTime" label="Time of vacate" />
                <TextField label="Address of stay during vacation" value="address" placeholder="Address..." />
                <TextField label="Parent's Email" value="email" placeholder="Parent's Email" />
                <CheckBoxField
                  options={hostelItemsOptions}
                  value="hostelItems"
                  label="Items handed over to hostel"
                />
                <View className="p-4 flex items-center gap-2">
                  <Text className="text-red-500 text-center">
                    I acknowledge that I vacated the room responsibly and will pay for any damages found later.
                  </Text>
                  <CheckBoxField
                    value="declaration"
                    options={[{ label: "I accept the declaration terms", value: "declare" }]}
                  />
                </View>
                <Button onPress={() => handleSubmit()}>
                  <ButtonText className="text-white font-semibold">SUBMIT</ButtonText>
                </Button>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
