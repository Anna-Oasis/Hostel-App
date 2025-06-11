import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { grievanceCategories } from "@/constants/admission";

const GrievanceForm = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  const [showDropdown, setShowDropdown] = useState(false);

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
              <View className="relative">
                <TouchableOpacity
                  onPress={() => setShowDropdown(!showDropdown)}
                  className="border border-gray-300 rounded-lg p-3 bg-white"
                >
                  <Text className={`${values.category ? 'text-gray-900' : 'text-gray-500'}`}>
                    {values.category 
                      ? grievanceCategories.find(cat => cat.value === values.category)?.label 
                      : 'Select a category'
                    }
                  </Text>
                </TouchableOpacity>
                
                {showDropdown && (
                  <View className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 z-10 shadow-lg">
                    {grievanceCategories.map((category) => (
                      <TouchableOpacity
                        key={category.value}
                        onPress={() => {
                          setFieldValue('category', category.value);
                          setShowDropdown(false);
                        }}
                        className="p-3 border-b border-gray-200 last:border-b-0"
                      >
                        <Text className="text-gray-900">{category.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
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