import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useField, useFormikContext } from "formik";

interface Props {
  value: string;
  placeholder: string;
}

const DatePickerField: React.FC<Props> = ({ value, placeholder }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(value);
  const [show, setShow] = useState(false);

  const currentDate = field.value ? new Date(field.value) : new Date();

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setFieldValue(value, selectedDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
    }
  };

  return (
    <View className="my-2">
      <Text className="text-base text-gray-700 mb-1">{placeholder}</Text>
      <Pressable onPress={() => setShow(true)} className="p-3 border rounded bg-white">
        <Text>{field.value || "Select Date"}</Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DatePickerField;
