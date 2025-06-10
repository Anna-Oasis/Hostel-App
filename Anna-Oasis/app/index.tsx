import { Text, View } from "react-native";
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
}
