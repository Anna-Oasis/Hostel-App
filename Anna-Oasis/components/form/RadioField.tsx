import { View } from "react-native";
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from "@/components/ui/radio";
import { CircleIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useFormikContext } from "formik";
import Label from "@/components/form/Label";

/**
 * Props for the RadioField component
 *
 * @interface RadioFieldProps
 * @property {string} [label] - Optional label text for the field
 * @property {string} value - Field name in the Formik form values
 * @property {Array<{label: string, value: string}>} options - Available options for selection
 */
interface RadioFieldProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
}

/**
 * RadioField component renders a group of radio buttons and integrates with Formik for form state management.
 * It provides a user-friendly way to select from mutually exclusive options.
 *
 * @example
 * <RadioField
 *   label="Gender"
 *   value="gender"
 *   options={[
 *     { label: "Male", value: "Male" },
 *     { label: "Female", value: "Female" },
 *     { label: "Other", value: "Other" }
 *   ]}
 * />
 *
 * @param {RadioFieldProps} props - Component props
 * @returns {JSX.Element} A radio button group
 */
function RadioField({ label, value, options }: RadioFieldProps) {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();

  /**
   * Handles the change event for the radio buttons.
   * Sets the selected option value in the Formik field.
   *
   * @param {string} optionValue - The value of the radio button option.
   */
  const handleRadioChange = (optionValue: string) => {
    setFieldValue(value, optionValue);
  };

  return (
    <View className="mb-4">
      {label && <Label text={label} />}
      <RadioGroup
        value={values[value]}
        onChange={(prop) => {
          handleRadioChange(prop);
        }}
      >
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            size="md"
            isInvalid={false}
            isDisabled={false}
          >
            <RadioIndicator>
              <RadioIcon as={CircleIcon} />
            </RadioIndicator>
            <RadioLabel>{option.label}</RadioLabel>
          </Radio>
        ))}
      </RadioGroup>
      {touched[value] && typeof errors[value] === 'string' && (
        <Text italic className="text-red-500 mt-1 text-xs">{errors[value]}</Text>
      )}
    </View>
  );
}

export default RadioField;