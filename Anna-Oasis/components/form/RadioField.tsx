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

function RadioField({ value, options }: RadioFieldProps) {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();
  return (
    <View>
      <RadioGroup
        value={values[value]}
        onChange={(value) => {
          setFieldValue(value, value);
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
      {touched[value] && errors[value] && (
        <Text italic style={{ color: "red", marginTop: 5 }}>{errors[value]}</Text>
      )}
    </View>
  );
}

export default RadioField;
