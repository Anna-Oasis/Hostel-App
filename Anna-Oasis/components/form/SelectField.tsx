import React from "react";
import { View, Text } from "react-native";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
  SelectScrollView
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { useFormikContext } from "formik";
import Label from "@/components/form/Label"

interface SelectFieldProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
}

/**
 * SelectField component renders a select dropdown and integrates with Formik for form state management.
 *
 * @param {string} label
 * @param {string} value - The value of the field in Formik values.
 * @param {Array<{ label: string, value: string }>} options - An array of options for the select dropdown.
 */
const SelectField = ({ label, value, options }: SelectFieldProps) => {
  const { values, setFieldValue, touched, errors } =
    useFormikContext<Record<string, any>>();

  // Get the selected value from Formik context
  const selectedValue = values[value];

  // Find the label for the selected value
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  return (
    <View>
      {label && <Label text={label} />}
      <Select
        onValueChange={(prop) => setFieldValue(value, prop)}
      >
        <SelectTrigger>
          <SelectInput
            placeholder="Select option"
            className="flex-1 my-3 py-2"
            value={selectedOption ? selectedOption.label : ""}
          />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent style={{ maxHeight: 400 }}>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectScrollView>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </SelectScrollView>
          </SelectContent>
        </SelectPortal>
      </Select>
      {touched[value] && typeof errors[value] === "string" && (
        <Text style={{ color: "red", marginTop: 5 }}>{errors[value]}</Text>
      )}
    </View>
  );
};

export default SelectField;
