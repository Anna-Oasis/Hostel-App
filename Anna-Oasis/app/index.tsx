
<!-- import { Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import TestForm from "@/components/TestForm";
import ApprovalCard from "@/components/ApprovalCard";
import { badgeStatus } from "@/components/ApprovalCard";

export default function Index() {
  return (
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //   }}
    // >
    //   <Text>Edit app/index.tsx to edit this screen.</Text>
    //   <Button size="md" variant="solid" action="primary">
    //     <ButtonText>Hello World!</ButtonText>
    //   </Button>
    // </View>
    <ApprovalCard 
      title="Gogul" 
      subTitle="Going for home" 
      onApprove={() => console.log("approve button")}
      onDecline={() => console.log("decline button")}
      badge={badgeStatus.Pending}
    />
  );
} -->

<!-- // import { Text, View } from "react-native";
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
// } -->

import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/Login");
    }, 0);

    return () => clearTimeout(timeout);
  }, [router]);

  return null;
}

