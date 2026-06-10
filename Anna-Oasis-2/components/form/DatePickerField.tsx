import React, { useState } from "react";
import { View, Platform} from "react-native";
import { useFormikContext } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text } from "@/components/ui/text";
import Label from "@/components/form/Label";
interface DatePickerFieldProps {
  label?: string;
  value: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  props?: any;
}

const DatePickerField = ({
  label,
  value,
  placeholder = "Select date",
  minimumDate,
  maximumDate,
  ...props
}: DatePickerFieldProps) => {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();
  const [show, setShow] = useState(false);

  const displayValue = values[value]
    ? values[value]
    : "";

  return (
    <View>
      {Platform.OS === "web" ? (
          <>
            {label && <Label text={label} />}
            <input
              type="date"
              value={values[value] || ""}
              onChange={(e) => setFieldValue(value, e.target.value)}
              min={minimumDate?.toISOString().split("T")[0]}
              max={maximumDate?.toISOString().split("T")[0]}
              className="p-4 w-[100%] rounded-3 border-2"
              {...props}
            />
          </>
      ) : (
        <>
          {label && <Label text={label} />}
          <Button onPress={() => setShow(true)} variant="outline" size="md">
            <ButtonText>
              {displayValue || placeholder}
            </ButtonText>
          </Button>
          {show && (
            <DateTimePicker
              mode="date"
              display="default"
              value={values[value] ? new Date(values[value]) : new Date()}
              onChange={(_, selectedDate) => {
                setShow(false);
                if (selectedDate) {
                  const formatted = selectedDate.toISOString().split("T")[0];
                  setFieldValue(value, formatted);
                }
              }}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              {...props}
            />
          )}
        </>
      )}
      {touched[value] && typeof errors[value] === "string" && (
        <Text italic style={{ color: "red", marginTop: 5 }}>
          {errors[value]}
        </Text>
      )}
    </View>
  );
};

export default DatePickerField;
