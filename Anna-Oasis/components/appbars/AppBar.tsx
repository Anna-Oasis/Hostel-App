import React from 'react';
import { View, Text, Image } from 'react-native';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { LogOut, HelpCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { removeToken } from '@/utils/authUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useUserStore from '@/stores/userStore';

interface AppBarProps {
  title: string;
}

export default function AppBar({ title }: AppBarProps) {
  const resetUser = useUserStore((state) => state.resetUser);

  const insets = useSafeAreaInsets();
  return (
    <View
      className="w-full flex-row justify-between items-center px-4 bg-white shadow-sm"
      style={{ paddingTop: insets.top + 6, paddingBottom: 8 }}
    >
      <View className="flex-row items-center">
        <Image
          source={require('@/assets/images/logo.png')}
          style={{ width: 36, height: 36, marginRight: 10 }}
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800">{title}</Text>
      </View>
      <View className="flex-row items-center">
        <Button
          onPress={() => {
            router.push('/Support');
          }}
          className="p-3 rounded-full bg-transparent mr-2"
          variant="link"
        >
          <ButtonIcon as={HelpCircle} className="w-6 h-6" color="#444444" />
          <ButtonText className="sr-only">
            Support
          </ButtonText>
        </Button>
        <Button
          onPress={() => {
            removeToken();
            resetUser();
            router.replace('/Login');
          }}
          className="p-3 rounded-full bg-transparent"
          variant="link"
        >
          <ButtonIcon as={LogOut} className="w-6 h-6" color="#444444" />
          <ButtonText className="sr-only">
            Logout
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}