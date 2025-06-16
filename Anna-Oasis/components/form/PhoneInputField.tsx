import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { Text } from '@/components/ui/text';
import { useFormikContext } from 'formik';
import Label from '@/components/form/Label';

/**
 * Props for the PhoneInputField component
 * 
 * @interface PhoneInputFieldProps
 * @property {string} [label] - Optional label text for the field
 * @property {string} value - Field name in the Formik form values
 * @property {string} [placeholder] - Optional placeholder text for the input
 */
interface PhoneInputFieldProps {
  label?: string;
  value: string;
  placeholder?: string;
}

/**
 * PhoneInputField component provides a phone input with country selector
 * that integrates with Formik. It uses react-native-phone-number-input to provide
 * a comprehensive phone input experience with country codes.
 * 
 * @example
 * <PhoneInputField label="Mobile" value="mobile" placeholder="Enter phone number" />
 * 
 * @param {PhoneInputFieldProps} props - Component props
 * @returns {JSX.Element} A phone input field with country code selector
 */
function PhoneInputField({ label, value, placeholder }: PhoneInputFieldProps) {
  const { values, setFieldValue, touched, errors } = useFormikContext<any>();
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef<PhoneInput>(null);

  return (
    <View className="mb-4">
      {label && <Label text={label} />}
      <PhoneInput
        ref={phoneInput}
        defaultValue={values[value]}
        defaultCode="IN" // Default to India
        layout="first"
        onChangeText={(text: string) => {
          setFieldValue(value, text);
        }}
        onChangeFormattedText={(text: string) => {
          setFormattedValue(text);
          setFieldValue(value, text);
        }}
        placeholder={placeholder || 'Phone number'}
        containerStyle={{ 
          width: '100%', 
          borderWidth: 1, 
          borderColor: '#d1d5db', 
          borderRadius: 6 
        }}
        textContainerStyle={{ 
          backgroundColor: 'transparent', 
          paddingVertical: 0 
        }}
      />
      {touched[value] && errors[value] && (
        <Text italic className="text-red-500 mt-1 text-xs">
          {typeof errors[value] === 'string' 
            ? errors[value] 
            : Array.isArray(errors[value]) 
              ? (errors[value] as string[]).join(', ') 
              : 'Invalid value'}
        </Text>
      )}
    </View>
  );
}

export default PhoneInputField;
