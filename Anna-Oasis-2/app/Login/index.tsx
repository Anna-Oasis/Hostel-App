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
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="flex-grow justify-center py-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 justify-center px-4 pb-8">
            <View className="items-center mb-8">
              <View className="rounded-3xl p-6 mb-6">
                <Image
                  source={require("@/assets/images/login_logo.png")}
                  className="w-72 h-72"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </Text>
              <Text className="text-lg text-gray-600 text-center leading-relaxed">
                Sign in to access your account
              </Text>
            </View>
            <View className="bg-white rounded-2xl shadow-xl p-6 mx-2">
              <LoginCard />
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
}
