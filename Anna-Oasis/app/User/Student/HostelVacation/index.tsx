import { ScrollView, View } from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import PhoneInputField from "@/components/form/PhoneInputField";
import DatePickerField from "@/components/form/DatePickerField";
import TimePickerField from "@/components/form/TimePickerField";
import CheckBoxField from "@/components/form/CheckBoxField";
import { Button, ButtonText } from "@/components/ui/button";
import {vacatingItems,initialValues} from "@/constants/vacatingHostels";
import { validationSchema } from "@/constants/vacatingHostelValidation";


const VacatingForm = () => {
  const handleSubmitted = (values: any) => {
    const submitValues = {
      ...values,
      declarationAccepted: values.declarationAccepted.includes("true"),
    };
    console.log('Form Submitted:', submitValues);
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitted}
      >
        {({ handleSubmit }) => (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <View className="space-y-4">
              <TextField label="Room No" value="roomNo" placeholder="Enter Room Number" />
              <DatePickerField label="Vacate Date" value="vacateDate" placeholder="YYYY-MM-DD" />
              <TimePickerField label="Vacate Time" value="vacateTime" placeholder="HH:MM"/>
              <TextField label="Future Address" value="futureAddress" placeholder="Permanent address" />
              <PhoneInputField label="Student Mobile" value="studentMobile" placeholder="Phone number" />
              <TextField label="Parent's Email" value="parentEmail" placeholder="Parent's Email" />
              <PhoneInputField label="Local Guardian Mobile" value="localGuardianMobile" placeholder="Guardian's Phone number" />

              <CheckBoxField
                label="Did you hand over all the items?"
                value="itemsReturned"
                options={vacatingItems.map((item) => ({
                  label: item,
                  value: item
                }))}
              />

              <CheckBoxField
                label="I acknowledge that I leave the room without any damages. If any issues are found later, I agree to pay the applicable charges."
                value="declarationAccepted"
                options={[
                  {
                    label: '',
                    value: "true"
                  }
                ]}
              />

              <Button onPress={() => handleSubmit()}>
                <ButtonText>Submit Vacating Form</ButtonText>
              </Button>
            </View>
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

export default VacatingForm;