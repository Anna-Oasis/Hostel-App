import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { leaveTypes } from "@/constants/details"
import SelectField from "@/components/form/SelectField";
import DatePickerField from "./form/DatePickerField";
import PhoneInputField from "./form/PhoneInputField";
import MultiLineText from "./form/MultiLineText";
import TimePickerField from "./form/TimePickerField";

const LeaveForm = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  return (
    <ScrollView 
    contentContainerStyle={{ padding: 20 }} 
    showsVerticalScrollIndicator={false}
    >
        <Text className="text-3xl font-bold text-gray-900 mb-4">Apply for Leave</Text>
        <Formik
          initialValues={{
            leave_type: "",
            from_date: "",
            from_time: "",
            to_date: "",
            to_time: "",
            reason: "",
            destination: "",
            emergency_contact: "",
          }}
          validationSchema={Yup.object().shape({
            leave_type: Yup.string().required("Leave type is required"),
            from_date: Yup.date().required("From date is required"),
            from_time : Yup.string().required("From time requires"),
            to_date: Yup.date()
              .required("To date is required")
              .min(Yup.ref('from_date'), "To date must be after from date"),
            to_time : Yup.string().required("To Time Required"),
            reason: Yup.string().required("Reason is required"),
            destination: Yup.string().required("Destination is required"),
            emergency_contact: Yup.string()
              .required("Emergency contact is required"),
            // .matches(/^[0-9]{10,15}$/, "Please enter a valid phone number"),
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

              <TimePickerField
                label="From Time"
                value="from_time"
                placeholder="Select Time"
              />

              <DatePickerField
                placeholder="YYYY-MM-DD"
                value="to_date"
                label="To Date"
              />

              <TimePickerField
                label="To Time"
                value="to_time"
                placeholder="Select Time"
              />

              <TextField
                placeholder="Enter reason for leave"
                value="reason"
                label="Reason"
              />

              <MultiLineText
                placeholder="Enter The Address of your full address with door no, Street, Area, District, country"
                value="destination"
                label="Destination"
              />

              <PhoneInputField
                placeholder="Enter emergency contact number"
                value="emergency_contact"
                label="Emergency Contact"
              />

              <Button onPress={() => {
                handleSubmit();
              }} className="mt-6">
                <ButtonText>Submit Leave Application</ButtonText>
              </Button>
            </View>
          )}
        </Formik>
    </ScrollView>
  );
}

export default LeaveForm;





