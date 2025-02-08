import { Text, View } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Button size="md" variant="solid" action="primary">
        <ButtonText>Hello World!</ButtonText>
      </Button>
    </View>
  );
}
