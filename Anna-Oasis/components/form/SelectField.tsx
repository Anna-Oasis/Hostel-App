import React from 'react';
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
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { useFormikContext } from "formik";

interface SelectFieldProps {
  value: string;
  options: { label: string; value: string }[];
}

/**
 * SelectField component renders a select dropdown and integrates with Formik for form state management.
 *
 * @param {string} value - The value of the field in Formik values.
 * @param {Array<{ label: string, value: string }>} options - An array of options for the select dropdown.
 */
const SelectField = ({ value, options }: SelectFieldProps) => {
  const { values, setFieldValue, touched, errors } = useFormikContext<Record<string, any>>();

  return (
    <View>
      <Select
        onValueChange={(prop) => setFieldValue(value, prop)}
      >
        <SelectTrigger>
          <SelectInput placeholder="Select option" className="flex-1" />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            {options.map((option) => (
              <SelectItem key={option.value} label={option.label} value={option.value} />
            ))}
          </SelectContent>
        </SelectPortal>
      </Select>
      {touched[value] &&typeof errors[value] === 'string' && (
        <Text style={{ color: 'red', marginTop: 5 }}>{errors[value]}</Text>
      )}
    </View>
  );
};

export default SelectField;