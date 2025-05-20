import { ScrollView, Text, View } from "react-native";
import CheckBoxField from "@/components/form/CheckBoxField";
import { Button, ButtonText } from "@/components/ui/button";
import SignatureUpload from "@/components/form/SignatureUpload";

const declarationText = [
  "➤ Resident will occupy the allotted room only and will not change the allotted room for any reason without the permission of the hostel authorities.",
  "All residents are required to carry their valid ID card issued to them by the University/hostel.",
  "➤ Residents must follow the proper dress code (outside the hostel area: - mess)",
  "➤ Smoking and consumption of alcoholic drink/or narcotic drugs in the hostel premises is strictly prohibited.",
  "➤ Students shall not enter the hostel premises in intoxicated state and should not possess such materials.",
  "Residents are requested to be back to the hostel by 09.00 pm (Boys)/08.30 pm (Girls) on weekdays and 09.30 pm (Boys)/09.00 pm (Girls) on weekends sharp and get their attendance recorded every day. It is the responsibility of every resident who is present in the premises to get his/her presence marked.",
  "Severe action will be taken if any resident is found to be late, resulting in expulsion from Hostel and rustication from the University.",
  "The rooms, common areas and surroundings should be kept clean and hygienic. Notices shall not be pasted on walls and walls shall not be scribbled on.",
  "➤ Residents should not leave the room open at any time in their absence. Do not hand over the keys of your room to any other persons. The hostel management is not responsible for any consequences.",
  "Switch off the AC/Heater/Lights and fans when not in use. The residents of a room are responsible for any damage to the property in the room.",
  "➤ Keep your valuables (money/laptops/phones, etc.) locked and secured all the time.",
  "➤ Ragging of students in hostel or University is strictly prohibited. Any violation of this by the students will be dealt very severely.",
  "Student's birthday celebrations are strictly prohibited inside the hostels at late nights and inside rooms.",
  "➤ Students are not permitted to break open their room lock or cupboard and cause any damage to the hostel property or common items.",
  "➤ Visitors to the hostel including the parents/guardians/friends/day scholars/general hostel students are not permitted entry into the hostel. I will forego my right to stay in the hostel if I entertain guest(s).",
  "Residents must follow the mess timings strictly and should not waste food.",
  "➤ The residents must behave properly with all the staff and fellow residents.",
  "➤ I will not use personal electric iron box, electric heating rods, wireless routers, etc. inside my room.",
  "I state that all the above are true to the best of my knowledge and belief.",
  "I undertake to abide by the rules of the hostel and I am fully aware that I shall be subjected to disciplinary action for infringement of any of the rules. If I violate the above hostel rules, I will forego my right to stay in the hostel.",
  "➤ I assure that my son/daughter will abide by the rules of the hostel.",
];

function DeclarationForm() {
  return (
    <ScrollView className="p-4 space-y-4">

      <View className="space-y-2">
        <Text className="text-lg font-semibold text-primary-400 text-center">DECLARATION AND UNDERTAKING</Text>
        {declarationText.map((line, index) => (
          <Text key={index} className="text-base text-primary-400">
            {line}
          </Text>
        ))}
      </View>

      <CheckBoxField
        value="declarationAccepted"
        options={[{ label: "I have read and agreed to the rules", value: "agree" }]}
      />

      <SignatureUpload value="studentSignature" label="Student's Signature" />

      <SignatureUpload value="parentSignature" label="Parent's Signature"/>

      <Button className="bg-primary-400 rounded-md">
        <ButtonText className="text-white font-semibold text-base">Download Details</ButtonText>
      </Button>
    </ScrollView>
  );
}

export default DeclarationForm;
