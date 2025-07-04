import React from 'react';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import { Mail, HelpCircle, Lightbulb, Bug } from 'lucide-react-native';

const SUPPORT_EMAIL = 'annaoasishostel@gmail.com';

const SupportPage = () => {
  return (
    <View className="flex-1 justify-center items-center px-5 bg-gray-50">
      <View className="mb-8 p-6 bg-white rounded-full shadow">
        <HelpCircle size={80} color="#2980b9" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Need Help or Found a Bug?
      </Text>
      <View className="flex-row items-center mb-4 gap-x-2">
        <Mail size={24} color="#e67e22" />
        <TouchableOpacity
          onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
          activeOpacity={0.7}
        >
          <Text className="text-lg text-blue-700 font-semibold underline">
            {SUPPORT_EMAIL}
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-base text-gray-500 text-center leading-6 mb-8">
        If you encounter any bugs, kindly report them via email.
        Feel free to contact us for help, support, reporting bugs, or feature suggestions.
      </Text>
      <View className="bg-white p-5 rounded-xl w-full max-w-xs shadow">
        <View className="flex-row items-center mb-3 gap-x-3">
          <Bug size={20} color="#e74c3c" />
          <Text className="text-sm text-gray-600 flex-1">
            Report bugs to help us improve your experience.
          </Text>
        </View>
        <View className="flex-row items-center mb-3 gap-x-3">
          <Lightbulb size={20} color="#f1c40f" />
          <Text className="text-sm text-gray-600 flex-1">
            Suggest features or improvements anytime.
          </Text>
        </View>
        <View className="flex-row items-center gap-x-3">
          <HelpCircle size={20} color="#2980b9" />
          <Text className="text-sm text-gray-600 flex-1">
            We're here to help with any questions or issues.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SupportPage;
