import React from 'react';
import { View, Text } from 'react-native';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { removeToken } from '@/utils/authUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StudentAppBarProps {
  title: string;
}

export default function StudentAppBar({ title }: StudentAppBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="w-full flex-row justify-between items-center px-4 bg-white shadow-sm"
      style={{ paddingTop: insets.top + 6, paddingBottom: 8 }}
    >
      <Text className="text-2xl font-bold text-gray-800">{title}</Text>
      <Button
        onPress={() => {
          removeToken();
          router.replace('/Login');
        }}
        className="p-2 rounded-full bg-transparent"
        variant="link"
      >
        <ButtonIcon as={LogOut} size="md" color="#444444" />
        <ButtonText className="sr-only">
            Logout
        </ButtonText>
      </Button>
    </View>
  );
}
