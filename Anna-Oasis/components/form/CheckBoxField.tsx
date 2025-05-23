import React from "react";
import { View, Text } from "react-native";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxIcon,
  CheckboxGroup,
} from "@/components/ui/checkbox";
import { CheckIcon } from "@/components/ui/icon";
import { useFormikContext } from "formik";
import Label from '@/components/form/Label'

interface CheckBoxFieldProps {
  label?:string,
  value: string;
  options: { label: string; value: string }[];
}

/**
 * CheckBoxField component renders a group of checkboxes and integrates with Formik for form state management.
 *
 * @param {string} label
 * @param {string} value - The name of the field in Formik values.
 * @param {Array<{ label: string, value: string }>} options - An array of options for the checkboxes.
 */
const CheckBoxField = ({ label, value, options }: CheckBoxFieldProps) => {
  const { values, setFieldValue, touched, errors } =
    useFormikContext<Record<string, any>>();

  /**
   * Handles the change event for the checkboxes.
   * Adds or removes the option value from the Formik field array.
   *
   * @param {string} optionValue - The value of the checkbox option.
   */
  const handleCheckboxChange = (optionValue: string) => {
    const currentValue = values[value] || [];
    const newValue = currentValue.includes(optionValue)
      ? currentValue.filter((val: string) => val !== optionValue)
      : [...currentValue, optionValue];
    setFieldValue(value, newValue);
  };

  return (
    <View>
      
      {label && <Label text={label}/>}
      <CheckboxGroup value={values[value] || []}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            value={option.value}
            isChecked={values[value]?.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
            size="md"
            isInvalid={touched[value] && !!errors[value]}
            isDisabled={false}
          >
            <CheckboxIndicator>
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel>{option.label}</CheckboxLabel>
          </Checkbox>
        ))}
      </CheckboxGroup>
      {touched[value] && typeof errors[value] === "string" && (
        <Text style={{ color: "red", marginTop: 5 }}>{errors[value]}</Text>
      )}
    </View>
  );
};

export default CheckBoxField;
