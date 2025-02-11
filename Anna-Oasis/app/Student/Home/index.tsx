import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import { useState } from "react";
import { View, Text } from "react-native";

export default function Home() {
  const [admissionFlag, setAdmissionFlag] = useState(0);

  const toggleAdmissionFlag = () => {
    setAdmissionFlag((prevFlag) => (prevFlag === 0 ? 1 : 0));
  };

  return (
    <View>
      <Button onPress={toggleAdmissionFlag}>
        <ButtonText>Toggle Admission Flag</ButtonText>
      </Button>
      {admissionFlag === 0 ? <Readmission /> : <Admission />}
    </View>
  );
}

function Readmission() {
  return (
    <View>
      <Button onPress={() => router.push("/Student/Home/ReadmissionForm")}>
        <ButtonText>Readmission</ButtonText>
      </Button>
      <Text>previous details here</Text>
    </View>
  );
}

function Admission() {
  return (
    <View>
      <Button onPress={() => router.push("/Student/Home/AdmissionForm")}>
        <ButtonText>Admission</ButtonText>
      </Button>
      <Text></Text>
    </View>
  );
}
