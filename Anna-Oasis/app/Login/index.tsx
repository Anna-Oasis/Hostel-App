import {
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { Text } from "@/components/ui/text";
import LoginCard from "@/components/auth/LoginCard";
import Footer from "@/components/appbars/Footer";
      

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
            <View className="flex-row items-center justify-center mb-2 mt-4">
              <Text className="text-3xl font-bold text-gray-900 mr-3">
                Anna Oasis
              </Text>
              <Image
                source={require("@/assets/images/anna_logo.png")}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>
            <Image
              source={require("@/assets/images/logo.png")}
              className="w-56 h-56 my-8"
              resizeMode="contain"
            />
            <Text className="text-base text-gray-600">Login to continue</Text>
          </View>
          <LoginCard />
        </View>
      </KeyboardAvoidingView>
      <Footer />
    </ScrollView>
  );
}
