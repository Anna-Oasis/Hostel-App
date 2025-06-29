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
function SwitchField({ label, value }: SwitchFieldProps) {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();

  /**
   * Handles the change event for the switch.
   * Sets the boolean value in the Formik field.
   *
   * @param {boolean} checked - The new value of the switch.
   */
  const handleSwitchChange = (checked: boolean) => {
    setFieldValue(value, checked);
  };

  return (
    <View className="mb-4 flex-row items-center">
      {label && <Label text={label} />}
      <Switch
        size="md"
        isDisabled={false}
        value={!!values[value]}
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
