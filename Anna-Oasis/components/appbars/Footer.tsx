import { View, Keyboard } from "react-native";
import { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Heart } from "lucide-react-native";

export default function Footer() {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (keyboardVisible) return null;

  return (
    <View
      className="absolute bottom-8 left-0 right-0 items-center opacity-20"
      pointerEvents="none"
    >
      <View className="flex-row items-center mb-0.5">
        <Text size="md" className="font-medium mr-1">
          Made with
        </Text>
        <Icon as={Heart} size="md" color="#e11d48" className="mx-0.5" />
        <Text size="md" className="font-medium ml-1">
          and passion
        </Text>
      </View>
      <Text size="sm" className="text-center">
        By students of Anna University
      </Text>
    </View>
  );
}
