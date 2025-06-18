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
          title: "",
          description: "",
          category: "",
        }}
        validationSchema={Yup.object().shape({
          title: Yup.string().required("Title is required"),
          description: Yup.string().required("Description is required"),
          category: Yup.string().required("Category is required"),
        })}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, values }) => (
          <View className="space-y-4">
            <TextField
              placeholder="Enter grievance title"
              value="title"
              label="Title"
            />
            <TextField
              placeholder="Describe your grievance"
              value="description"
              label="Description"
            />

            <SelectField
              label="Category"
              value="category"
              options={grievanceCategories}
            />

            <Button onPress={() => {
                console.log(values);
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