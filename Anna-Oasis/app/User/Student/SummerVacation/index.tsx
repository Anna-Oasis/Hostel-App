import CheckBoxField from "@/components/form/CheckBoxField";
import DatePickerField from "@/components/form/DatePickerField";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Formik } from "formik";
import { ScrollView } from "react-native";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import * as Yup from 'yup';
import TimePickerField from "@/components/form/TimePickerField";
import { submitSummerVacationRequest } from "@/utils/student/studentApi";


export default function SummerVacationPage() {

  const hostelItemsOptions: { label: string; value: string }[] = [
    { label: "AC Remote", value: "AC Remote" },
    { label: "Room Keys", value: "Room Keys" },
    { label: "Lan Cable", value: "Lan Cable" },
    { label: "Cupboard Keys", value: "Cupboard Keys" },
  ];

  const summerVacationSchema = Yup.object().shape({
    vacationDate: Yup.string().required("Date of vacate is required"),
    vacationTime: Yup.string().required("Time of vacate is required"),
    address: Yup.string().required("Address is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Parent's email is required"),
    hostelItems: Yup.array()
      .min(1, "Please select at least one handed over item")
      .required("Please select at least one handed over item"),
    declaration: Yup.array()
      .min(1, "You must agree to the declaration before submitting")
      .required("You must agree to the declaration before submitting"),
  });




  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>

        <View className="flex-1 justify-center p-4 items-center">

          <Text
            className="text-2xl font-normal"
          >SummarVacation Form</Text>

          <View className="p-2">
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
                console.log(values);
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

                  <DatePickerField
                    minimumDate={new Date()}
                    value="vacationDate"
                    label="Date of vacate"
                  />

                  <TimePickerField
                    value="vacationTime"
                    label="Time of vacate"
                  />

                  <TextField
                    label="Address of stay during vacation"
                    value="address"
                    placeholder="Address of Stay during vacation"
                  />

                  <TextField
                    label="Parent's Email"
                    value="email"
                    placeholder="Enter Parent's Email"
                  />

                  <CheckBoxField
                    options={hostelItemsOptions}
                    value="hostelItems"
                    label="Did you handover all the items given by International Hostel ?" />

                  <View className="p-4 flex items-center gap-2">
                    <Text
                      className="text-red-500"
                    >
                      Hereby, I acknowledge and declare that I leave the room without any damages upto the best of my knowledge.
                      If the authorities find any further issues, I accept to pay the damage charges as per the hostel norms.
                    </Text>
                    <CheckBoxField
                      value="declaration"
                      options={[{ label: 'I declare and agree with the hostel terms', value: 'decalre' }]} />
                  </View>
                  <Button
                    onPress={() => handleSubmit()}
                  >
                    <ButtonText className="text-white font-semibold">SUBMIT</ButtonText>
                  </Button>
                </View>
              )}
            </Formik>
          </View>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}
