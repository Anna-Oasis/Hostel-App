import React from "react";
import { View, Text } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { grievanceCategories } from "@/constants/admission";

const GrievanceForm = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  return (
    <View className="flex-1 bg-white p-6">
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
        {({ handleSubmit, values, setFieldValue }) => (
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
        
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Category</Text>
              <View className="space-y-2">
                {grievanceCategories.map((category) => (
                  <Button
                    key={category.value}
                    variant={values.category === category.value ? "solid" : "outline"}
                    onPress={() => setFieldValue('category', category.value)}
                    className="justify-start"
                  >
                    <ButtonText>{category.label}</ButtonText>
                  </Button>
                ))}
              </View>
            </View>

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