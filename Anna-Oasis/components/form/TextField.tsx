import { View } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { useFormikContext, ErrorMessage } from "formik";
import { Text } from "@/components/ui/text";

interface TextFieldProps {
  placeholder: string;
  value: string;
  props?: any;
}

/**
 * TextField component renders a text input field and integrates with Formik for form state management.
 *
 * @param {string} placeholder - The placeholder text for the input field.
 * @param {string} value - The name of the field in Formik values.
 * @param {any} props - Additional props for the input field.
 */
function TextField({ placeholder, value, ...props }: TextFieldProps) {
  const { values, handleBlur, handleChange, touched, errors } = useFormikContext<any>();

  return (
    <View>
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={touched[value] && !!errors[value]}
        isReadOnly={false}
      >
        <InputField
          placeholder={placeholder}
          onChangeText={handleChange(value)}
          onBlur={handleBlur(value)}
          value={values[value]}
          {...props}
        />
      </Input>
      {touched[value] && typeof errors[value] === 'string' && (
        <Text italic style={{ color: 'red', marginTop: 5 }}>{errors[value]}</Text>
      )}
    </View>
  );
}

export default TextField;