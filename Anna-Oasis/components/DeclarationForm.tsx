import CheckBoxField from "@/components/form/CheckBoxField";
import { ScrollView, View, Text } from "react-native";

const declarationPoints = [
    "Resident will occupy the allotted room only and will not change the allotted room for any reason without the permission of the hostel authorities",
    "All residents are required to carry their valid ID card issued to them by the University/hostel. ",
    "Residents must follow the proper dress code (outside the hostel area: - mess)",
    "Smoking and consumption of alcoholic drink / or narcotic drugs in the hostel premises is strictly prohibited. ",
  ];

function DeclarationForm(){
    return(
        <View >
        <ScrollView >
          {declarationPoints.map((point, index) => (
            // Update
            <Text key={index}>    
              • {point} 
            </Text>
          ))}
        </ScrollView>

        <CheckBoxField
          value="declarationAccepted"
          options={[{ label: "I have read and agreed to the rules", value: "agree" }]}
        />
      </View>  
    );
}

export default DeclarationForm