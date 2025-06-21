import { View, Text } from "react-native";
import AppBar from "@/components/appbars/AppBar";
export default function ResearchPage() {
  return (
    <>
      <AppBar title="Research Scholar" />
      <View className="flex-1 justify-center items-center">
        <Text>Research Scholar Services (Coming Soon)</Text>
      </View>
    </>
  );
}