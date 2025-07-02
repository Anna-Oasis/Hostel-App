import { View, Text } from 'react-native'
import React from 'react'
import { ScrollText, FileText, Info, CheckCircle2 } from 'lucide-react-native'

const DeclarationPage = () => {
  return (
    <View className="flex-1 justify-center items-center px-5 bg-gray-50">
      <View className="mb-8 p-6 bg-white rounded-full shadow">
        <ScrollText size={80} color="#2980b9" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Declaration Feature Coming Soon
      </Text>
      <View className="flex-row items-center mb-4 space-x-2">
        <FileText size={24} color="#27ae60" />
        <Text className="text-lg text-green-600 font-semibold">
          Under Development
        </Text>
      </View>
      <Text className="text-base text-gray-500 text-center leading-6 mb-8">
        The declaration management feature will be available in a future update.
        Soon, you will be able to review, verify, and manage all student and parent
        declarations for the academic year here.
      </Text>
      <View className="bg-white p-5 rounded-xl w-full max-w-xs shadow">
        <View className="flex-row items-center mb-3 space-x-3">
          <CheckCircle2 size={20} color="#27ae60" />
          <Text className="text-sm text-gray-600 flex-1">
            All declarations must be approved before admission is finalized.
          </Text>
        </View>
        <View className="flex-row items-center space-x-3">
          <Info size={20} color="#2980b9" />
          <Text className="text-sm text-gray-600 flex-1">
            Stay tuned for updates in upcoming releases.
          </Text>
        </View>
      </View>
    </View>
  )
}

export default DeclarationPage