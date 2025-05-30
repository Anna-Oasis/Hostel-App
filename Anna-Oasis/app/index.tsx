// import { Text, View } from "react-native";
// import { Button, ButtonText } from "@/components/ui/button";
// import TestForm from "@/components/TestForm";
// import React from "react";
// import { Link, router } from "expo-router";

// export default function Index() {
//   return (
//     <>
//       <View className="flex m-4 gap-4">
//         <Button onPress={() => router.push("/Login")}>
//           <ButtonText>Student</ButtonText>
//         </Button>
//         <Button>
//           <ButtonText>Admin</ButtonText>
//         </Button>
//       </View>
//     </>
//   );
// }
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the Login page
    const timeout = setTimeout(() => {
      router.push("/Login");
    }, 0);

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [router]);

  return null; // Render nothing
}