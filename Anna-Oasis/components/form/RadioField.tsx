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
import { useFormikContext, ErrorMessage } from "formik";

interface RadioFieldProps {
  value: string;
  options: { label: string; value: string }[];
}

/**
 * RadioField component renders a group of radio buttons and integrates with Formik for form state management.
 *
 * @param {string} value - The name of the field in Formik values.
 * @param {Array<{ label: string, value: string }>} options - An array of options for the radio buttons.
 */
function RadioField({ value, options }: RadioFieldProps) {
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
    <View>
      <RadioGroup
        value={values[value]}
        onChange={(prop) => {
          handleRadioChange(prop);
          console.log(value);
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
        <Text italic style={{ color: "red", marginTop: 5 }}>{errors[value]}</Text>
      )}
    </View>
  );
}

export default RadioField;