
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFormikContext } from "formik";
import Label from "@/components/form/Label";


interface TimePickerFieldProps {
  label: string;
  value: string;
  placeholder?: string;
}

/**
 * TimePickerField is a reusable React Native component for selecting time values in forms managed by Formik.
 *
 * @remarks
 * This component displays a label, a pressable input with a placeholder, and opens a native time picker modal.
 * The selected time is stored in Formik state in "HH:MM" (24-hour) format.
 *
 * @param props - The props for the TimePickerField component.
 * @param props.label - The label text displayed above the field.
 * @param props.value - The Formik field name to bind the value to.
 * @param props.placeholder - (Optional) Placeholder text shown when no time is selected.
 *
 * @example
 * ```tsx
 * <Formik initialValues={{ time: "" }} onSubmit={...}>
 *   <TimePickerField label="Select Time" value="time" placeholder="Choose a time" />
 * </Formik>
 * ```
 *
 * @returns A React element that renders a time picker integrated with Formik.
 */
//
// Props:
// | Prop        | Type   | Required | Description                                       |
// |-------------|--------|----------|-------------------------------------------------- |
// | label       | string | Yes      | The label text displayed above the field          |
// | value       | string | Yes      | The Formik field name to bind the value to        |
// | placeholder | string | No       | Placeholder text shown when no time is selected   |
export default function TimePickerField({ label, value, placeholder }: TimePickerFieldProps) {
  const { setFieldValue, values } = useFormikContext<any>();
  const [show, setShow] = useState(false);

  const timeValue = values[value];

  return (
    <View style={{ marginBottom: 1 }}>
      {label && <Label text={label} />}
      <Pressable
        onPress={() => setShow(true)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          padding: 12,
          backgroundColor: "#fff",
        }}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={{ color: timeValue ? "#111" : "#888" }}>
          {timeValue ? timeValue : placeholder || "Select Time"}
        </Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={timeValue ? new Date(`1970-01-01T${timeValue}:00`) : new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(_, selectedDate) => {
            setShow(false);
            if (selectedDate) {
              const hours = selectedDate.getHours().toString().padStart(2, "0");
              const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
              setFieldValue(value, `${hours}:${minutes}`);
            }
          }}
        />
      )}
    </View>
  );
}