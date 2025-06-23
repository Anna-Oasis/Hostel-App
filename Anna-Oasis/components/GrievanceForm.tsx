import React from "react";
import { View, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { grievanceCategories } from "@/constants/admission";
import SelectField from "./form/SelectField";

const GrievanceForm = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  return (
    <View className="flex bg-white ">
      <Text className="text-3xl font-bold text-gray-900 mb-4">File a Grievance</Text>
      <Formik
        initialValues={{
          subject: "",
          description: "",
          grievance_type: "",
        }}
        validationSchema={Yup.object().shape({
          subject: Yup.string().required("Subject is required"),
          description: Yup.string().required("Description is required"),
          grievance_type: Yup.string().required("Category is required"),
        })}
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