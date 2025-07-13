import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { getToken, verifyToken, redirectByRole } from "@/utils/authUtils";
import { useNotification } from "@/context/NotificationContext";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { expoPushToken, notification, error } = useNotification();
  if(error){
    console.error("Notification error:", error);
  }
  console.log(JSON.stringify(notification, null, 2));
  console.log("Expo Push Token:", expoPushToken);
  console.log(JSON.stringify(notification?.request.content.title));
  console.log(JSON.stringify(notification?.request.content.data, null, 2));
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        const token = await getToken();
        
        if (token) {
          const user = await verifyToken(token);

          if (user) {
            console.log("Token is valid, redirecting based on role...", user.role);
            setTimeout(() => {
              redirectByRole(user.role);
              setLoading(false);
            }, 5000);
            return;
          }
        }
        
        setTimeout(() => {
          router.replace("/Login");
          setLoading(false);
        }, 5000);
      } catch (error) {
        console.error("Session expired - Please login", error);
        setTimeout(() => {
          router.replace("/Login");
          setLoading(false);
        }, 5000);
      }
    };

    checkTokenAndRedirect();
  }, [router]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [loading]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <Image
          source={require("@/assets/images/no_text_logo.png")}
          className="w-80 h-80 mb-8"
          resizeMode="contain"
        />
        {/* <View className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <View 
            className="h-full bg-[#022B60] rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </View>
        <Text className="text-sm text-gray-500 mt-4">
          {Math.round(progress)}%
        </Text> */}
      </View>
    );
  }

  return null;
}