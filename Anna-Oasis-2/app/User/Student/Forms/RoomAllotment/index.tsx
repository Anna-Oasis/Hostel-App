import { View, Alert } from "react-native";
import { router } from "expo-router";
import { FileTextIcon, ClipboardIcon, HomeIcon } from "lucide-react-native";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

const forms = [
  {
    title: "Application Form",
    route: "/User/Student/Forms/ApplicationForm",
    icon: FileTextIcon,
    enabled: true,
  },
  {
    title: "Room Allotment",
    route: "/User/Student/Forms/RoomAllotment",
    icon: HomeIcon,
    enabled: true,
  },
  {
    title: "Re-Admission Form",
    route: "/User/Student/Forms/ReAdmissionForm",
    icon: ClipboardIcon,
    enabled: true,
  },
];

export default function FormsPage() {
  return (
    <View className="flex-1 p-8">
      {forms.map((form) => (
        <Button
          key={form.title}
          className="mb-4 h-24 rounded-xl flex-row justify-start px-6"
          style={[
            { backgroundColor: "#022B60" },
            !form.enabled && { opacity: 0.5 },
          ]}
          variant="solid"
          onPress={() => {
            if (form.enabled && form.route) {
              router.push(form.route as any);
              return;
            }

            Alert.alert("Coming Soon", `${form.title} is not ready yet.`);
          }}
        >
          <ButtonIcon as={form.icon} size="xl" color="white" />
          <ButtonText className="ml-4 text-xl font-medium">
            {form.title}
          </ButtonText>
        </Button>
      ))}
    </View>
  );
}