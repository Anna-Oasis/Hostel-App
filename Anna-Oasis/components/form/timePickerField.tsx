import React, { useState } from "react";
import { View, Platform } from "react-native";
import { useFormikContext } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import DateTimePicker from "@react-native-community/datetimepicker";
import Label from "@/components/form/Label";

interface TimePickerFieldProps {
  label?: string;
  value: string;
  placeholder?: string;
  props?: any;
}

const TimePickerField = ({
  label,
  value,
  placeholder = "Select time",
  ...props
}: TimePickerFieldProps) => {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();
  const [show, setShow] = useState(false);

  const displayValue = values[value] ? values[value] : "";

  return (
    <View>
      {label && <Label text={label} />}
      <Button onPress={() => setShow(true)} variant="outline" size="md">
        <ButtonText>
          {displayValue || placeholder}
        </ButtonText>
      </Button>
      {show && (
        <DateTimePicker
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          value={new Date()}
          onChange={(_, selectedTime) => {
            setShow(false);
            if (selectedTime) {
              const formatted = selectedTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              setFieldValue(value, formatted);
            }
          }}
          is24Hour={false}
          {...props}
        />
      )}
      {touched[value] && typeof errors[value] === "string" && (
        <Text italic style={{ color: "red", marginTop: 5 }}>
          {errors[value]}
        </Text>
      )}
    </View>
  );
};

export default TimePickerField;
