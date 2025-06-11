import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { leaveTypes } from "@/constants/details"
import SelectField from "@/components/form/SelectField";
import DatePickerField from "./form/DatePickerField";
import { Phone } from "lucide-react-native";
import PhoneInput from "react-native-phone-number-input";
import PhoneInputField from "./form/PhoneInputField";

const LeaveForm = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-3xl font-bold text-gray-900 mb-4">Apply for Leave</Text>
      <Formik
        initialValues={{
          leave_type: "",
          from_date: "",
          to_date: "",
          reason: "",
          destination: "",
          emergency_contact: "",
        }}
        validationSchema={Yup.object().shape({
          leave_type: Yup.string().required("Leave type is required"),
          from_date: Yup.date().required("From date is required"),
          to_date: Yup.date()
            .required("To date is required")
            .min(Yup.ref('from_date'), "To date must be after from date"),
          reason: Yup.string().required("Reason is required"),
          destination: Yup.string().required("Destination is required"),
          emergency_contact: Yup.string()
            .required("Emergency contact is required")
            .matches(/^[0-9]{10,15}$/, "Please enter a valid phone number"),
        })}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, values }) => (
          <View className="space-y-4">
            <SelectField 
                label="Leave Type"
                value="leave_type"
                options={leaveTypes}
            />
            <DatePickerField
              placeholder="YYYY-MM-DD"
              value="from_date"
              label="From Date"
            />

            <DatePickerField
              placeholder="YYYY-MM-DD"
              value="to_date"
              label="To Date"
            />

            <TextField
              placeholder="Enter reason for leave"
              value="reason"
              label="Reason"
            />

            <TextField
              placeholder="Enter destination"
              value="destination"
              label="Destination"
            />

            <PhoneInputField
              placeholder="Enter emergency contact number"
              value="emergency_contact"
              label="Emergency Contact"
            />

            <Button onPress={() => {
                console.log(values);
                handleSubmit();
            }} className="mt-6">
              <ButtonText>Submit Leave Application</ButtonText>
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}

export default LeaveForm;