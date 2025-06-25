import { View } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ReactNode } from "react";
import { Inbox } from "lucide-react-native";

interface EmptyPageProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
}

export default function EmptyPage({
  icon: IconComponent = Inbox,
  title,
  description,
}: EmptyPageProps) {
  return (
    <View className="flex-1 justify-center items-center mt-16">
      <Icon as={IconComponent} size="xl" color="#a3a3a3" className="mb-4" />
      <Text size="lg" className="text-typography-400 font-semibold mb-2">
        {title}
      </Text>
      {description && (
        <Text size="sm" className="text-typography-300 text-center">
          {description}
        </Text>
      )}
    </View>
  );
}
