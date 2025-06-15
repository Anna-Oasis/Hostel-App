import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { getToken, verifyToken, redirectByRole } from "@/utils/authUtils";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        const token = await getToken();

        if (token) {
          const user = await verifyToken(token);

          if (user) {
            console.log("Token is valid, redirecting based on role...", user.role);
            redirectByRole(user.role);
            return;
          }
        }
        
        router.replace("/Login");
      } catch (error) {
        console.error("Error during token verification:", error);
        router.replace("/Login");
      } finally {
        setLoading(false);
      }
    };

    checkTokenAndRedirect();
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-base text-gray-600">Loading...</Text>
      </View>
    );
  }

  return null;
}