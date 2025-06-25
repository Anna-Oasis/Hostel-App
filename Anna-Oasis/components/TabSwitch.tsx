import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";

interface TabSwitchProps<T extends string> {
  tabs: { label: string; value: T }[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
  icons?: { [key in T]?: React.ElementType };
}

function TabSwitch<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  icons = {},
}: TabSwitchProps<T>) {
  return (
    <View className={`flex-row justify-around ${className}`}>
      {tabs.map((tab) => {
        const IconComponent = icons[tab.value];
        return (
          <TouchableOpacity
            key={tab.value}
            className={`flex-1 py-3 items-center border-b-2 ${
              activeTab === tab.value ? "border-blue-600" : "border-gray-200"
            }`}
            onPress={() => onTabChange(tab.value)}
          >
            {IconComponent && (
              <Icon
                as={IconComponent}
                size="md"
                className={`mb-1 ${
                  activeTab === tab.value ? "text-blue-600" : "text-gray-400"
                }`}
              />
            )}
            <Text
              className={`text-lg font-semibold ${
                activeTab === tab.value ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default TabSwitch;
