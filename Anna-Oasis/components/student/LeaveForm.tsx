import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Formik } from "formik";
import { studentLeaveFormValidation } from "@/constants/validations/studentLeaveFormValidation";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { leaveTypes } from "@/constants/details";
import SelectField from "@/components/form/SelectField";
import DatePickerField from "@/components/form/DatePickerField";
import PhoneInputField from "@/components/form/PhoneInputField";
import MultiLineText from "@/components/form/MultiLineText";
import TimePickerField from "@/components/form/TimePickerField";

const combineDateTime = (date: string, time: string) => {
  if (!date || !time) return null;
  return new Date(`${date}T${time}`);
};

const LeaveForm = ({ onSubmit }: { onSubmit: (values: any) => void }) => {
  return (
    <ScrollView
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={false}
    >
      <Text className="text-3xl font-bold text-gray-900 mb-4">
        Apply for Leave
      </Text>
      <Formik
        initialValues={{
          leave_type: "",
          from_date: "",
          from_time: "",
          to_date: "",
          to_time: "",
          reason: "",
          address_of_stay: "",
          mobile: "",
          email: "",
        }}
        validationSchema={studentLeaveFormValidation}
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
              value="address_of_stay"
              label="Address of Stay"
            />

            <PhoneInputField
              placeholder="Enter emergency contact number in your address of stay"
              value="mobile"
              label="Emergency contact number"
            />

            <TextField
              placeholder="Guardian email address"
              value="email"
              label="Email Address"
            />

            <Button
              onPress={() => {
                handleSubmit();
              }}
              className="mt-6"
            >
              <ButtonText>Submit Leave Application</ButtonText>
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default LeaveForm;
