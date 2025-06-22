import {
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { Text } from "@/components/ui/text";
import LoginCard from "@/components/auth/LoginCard";
export default function Login() {

  return (
    <ScrollView
      className="flex-1 bg-white px-4"
      contentContainerClassName="flex-grow justify-center py-10"
      keyboardShouldPersistTaps="handled"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6 pb-10">
          <View className="items-center mb-12">
            <Text className="text-3xl font-bold text-gray-900 mt-4 mb-2">
              Anna Oasis
            </Text>
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-48 h-48 my-8"
              resizeMode="contain"
            />
            <Text className="text-base text-gray-600">Login to continue</Text>
          </View>
          <LoginCard />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
