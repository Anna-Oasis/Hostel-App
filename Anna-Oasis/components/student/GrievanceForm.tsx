import React from "react";
import { View, Text } from "react-native";
import { Formik } from "formik";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { grievanceCategories, grievanceInitialValues } from "@/constants/grievance";
import SelectField from "@/components/form/SelectField";
import { grievanceValidationSchema } from "@/constants/validations/grievanceValidation";

const GrievanceForm = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  return (
    <View className="flex bg-white ">
      <Text className="text-3xl font-bold text-gray-900 mb-4">File a Grievance</Text>
      <Formik
        initialValues={grievanceInitialValues}
        validationSchema={grievanceValidationSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit }) => (
          <View className="space-y-4">
            <TextField
              placeholder="Enter grievance title"
              value="subject"
              label="Subject"
            />
            <TextField
              placeholder="Describe your grievance"
              value="description"
              label="Description"
            />

            <SelectField
              label="Category"
              value="grievance_type"
              options={grievanceCategories}
            />

            <Button onPress={() => {
                handleSubmit();
            }} className="mt-6">
              <ButtonText>Submit Grievance</ButtonText>
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}

export default GrievanceForm;