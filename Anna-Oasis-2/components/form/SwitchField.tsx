import { View } from "react-native";
import { Switch } from "@/components/ui/switch";
import colors from "tailwindcss/colors";
import { useFormikContext } from "formik";
import Label from "@/components/form/Label";
import { Text } from "@/components/ui/text";

/**
 * Props for the SwitchField component
 *
 * @interface SwitchFieldProps
 * @property {string} [label] - Optional label text for the field
 * @property {string} value - Field name in the Formik form values
 */
interface SwitchFieldProps {
  label?: string;
  value: string;
  checkedValue?: any;
  uncheckedValue?: any;
}

/**
 * SwitchField component renders a switch and integrates with Formik for form state management.
 *
 * @example
 * <SwitchField
 *   label="Enable Notifications"
 *   value="notificationsEnabled"
 * />
 *
 * @param {SwitchFieldProps} props - Component props
 * @returns {JSX.Element} A switch field
 */
function SwitchField({ label, value, checkedValue = true, uncheckedValue = false }: SwitchFieldProps) {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();

  // Determine switch value based on checkedValue/uncheckedValue
  const switchValue = values[value] === checkedValue;

  // Set checkedValue or uncheckedValue in Formik
  const handleSwitchChange = (checked: boolean) => {
    setFieldValue(value, checked ? checkedValue : uncheckedValue);
  };

  return (
    <View className="mb-4 flex-row items-center">
      {label && <Label text={label} />}
      <Switch
        size="md"
        isDisabled={false}
        value={switchValue}
        onValueChange={handleSwitchChange}
        trackColor={{ false: colors.neutral[300], true: colors.neutral[600] }}
        thumbColor={colors.neutral[50]}
        ios_backgroundColor={colors.neutral[300]}
        className="ml-2"
      />
      {touched[value] && typeof errors[value] === 'string' && (
        <Text italic className="text-red-500 mt-1 text-xs">{errors[value]}</Text>
      )}
    </View>
  );
}

export default SwitchField;
