import { View, TouchableOpacity } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { useFormikContext } from "formik";
import { Text } from "@/components/ui/text";
import Label from "@/components/form/Label";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";

interface PasswordFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  props?: any;
}

/**
 * PasswordField component renders a password input field and integrates with Formik for form state management.
 *
 * @param {string} placeholder - The placeholder text for the input field.
 * @param {string} value - The name of the field in Formik values.
 * @param {any} props - Additional props for the input field.
 */
function PasswordField({ label, placeholder, value, ...props }: PasswordFieldProps) {
  const { values, handleBlur, handleChange, touched, errors } = useFormikContext<any>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      {label && <Label text={label} />}
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={touched[value] && !!errors[value]}
        isReadOnly={false}
        className="relative"
      >
        <InputField
          placeholder={placeholder}
          onChangeText={handleChange(value)}
          onBlur={handleBlur(value)}
          value={values[value]}
          secureTextEntry={!showPassword}
          {...props}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? (
            <EyeOff size={20} color="#6B7280" />
          ) : (
            <Eye size={20} color="#6B7280" />
          )}
        </TouchableOpacity>
      </Input>
      {touched[value] && typeof errors[value] === 'string' && (
        <Text italic style={{ color: 'red', marginTop: 5 }}>{errors[value]}</Text>
      )}
    </View>
  );
}

export default PasswordField;
