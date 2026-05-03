import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import { useFormikContext } from "formik";
import Label from "@/components/form/Label";

interface SearchableSelectFieldProps {
  label?: string;
  value: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

const SearchableSelectField = ({ label, value, options, placeholder }: SearchableSelectFieldProps) => {
  const { values, setFieldValue, touched, errors } = useFormikContext<Record<string, any>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedValue = values[value];
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (option: { label: string; value: string }) => {
    setFieldValue(value, option.value);
    setSearchQuery(option.label);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchQuery("");
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 3000);
  };

  return (
    <View className="mb-4">
      {label && <Label text={label} />}
      <Input className="mb-2 h-12">
        <InputField
          placeholder={placeholder || "Search and select..."}
          value={isOpen ? searchQuery : (selectedOption?.label || "")}
          onChangeText={setSearchQuery}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="py-3 text-gray-900 h-full"
          placeholderTextColor="#6B7280"
          style={{ lineHeight: 20 }}
        />
      </Input>
      
      {isOpen && (
        <View className="bg-white border border-gray-300 rounded-lg max-h-48 shadow-lg z-50 w-full">
          <ScrollView nestedScrollEnabled>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleSelect(item)}
                  className="px-3 py-3 border-b border-gray-200 active:bg-gray-100"
                >
                  <Text className="text-gray-900 text-base flex-1" numberOfLines={0}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text className="text-gray-500 text-center p-4 text-base">No options found</Text>
            )}
          </ScrollView>
        </View>
      )}
      
      {touched[value] && typeof errors[value] === "string" && (
        <Text className="text-red-500 text-sm mt-1">{errors[value]}</Text>
      )}
    </View>
  );
};

export default SearchableSelectField;
