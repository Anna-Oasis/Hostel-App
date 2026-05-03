/**
 * TabSwitch Component
 * -------------------
 * A reusable tab switcher for React Native.
 *
 * @template T - The type of the tab value.
 *
 * @param {Object} props
 * @param {{ label: string; value: T }[]} props.tabs - Array of tab objects with label and value.
 * @param {T} props.activeTab - The currently active tab value.
 * @param {(tab: T) => void} props.onTabChange - Callback when a tab is selected.
 * @param {string} [props.className] - Optional className for styling.
 * @param {{ [key in T]?: React.ElementType }} [props.icons] - Optional mapping of tab values to icon components.
 *
 * @example
 * import TabSwitch from "@/components/TabSwitch";
 * import { FilePlus2, History } from "lucide-react-native";
 * 
 * const [activeTab, setActiveTab] = useState<"form" | "history">("form");
 * 
 * <TabSwitch
 *   tabs={[
 *     { label: "Leave Form", value: "form" },
 *     { label: "History", value: "history" },
 *   ]}
 *   activeTab={activeTab}
 *   onTabChange={setActiveTab}
 *   icons={{
 *     form: FilePlus2,
 *     history: History,
 *   }}
 * />
 */

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
              activeTab === tab.value ? "border-[#022B60]/80" : "border-gray-200"
            }`}
            onPress={() => onTabChange(tab.value)}
          >
            {IconComponent && (
              <Icon
                as={IconComponent}
                size="md"
                className={`mb-1 ${
                  activeTab === tab.value ? "text-[#022B60]" : "text-gray-400"
                }`}
              />
            )}
            <Text
              className={`text-lg font-semibold ${
                activeTab === tab.value ? "text-[#022B60]" : "text-gray-500"
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
