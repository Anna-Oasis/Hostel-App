import { ScrollView, View,Text } from "react-native";
import TextField from "@/components/form/TextField";
import RadioField from "@/components/form/RadioField";
import SelectField from "@/components/form/SelectField";

const courseOptions = [
  { label: "course1", value: "course1" },
  { label: "course2", value: "course2" },
  { label: "course3", value: "course3" },
];

const Options = [
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const branchOptions = [
  { label: "Information Technology", value: "Information Technology" },
  { label: "Geoinformatics", value: "Geoinformatics" },
  { label: "Printing", value: "Printing" },
];

function GeneralForm() {
  return (
    <ScrollView>

      <View className="p-4 space-y-10">
        
        <View>
          <Text className="text-lg font-semibold text-primary-300">Hostel Block</Text> 
          <RadioField
            value="hostelBlock"
            options={[{ label: "Flora (Boys)", value: "Flora" }, { label: "Lavender (Girls)", value: "Lavender" }]}
          />
          <TextField
            placeholder="Name"
            value="name"
          />
        </View>

        <View>
        <Text className="mb-1 text-base font-medium text-primary-300">Course</Text>
        <SelectField
          value="course" 
          options={courseOptions} />
        </View>
        
        <View>
        <Text className="mb-1 text-base font-medium text-primary-300"> Branch</Text> 
        <SelectField 
          value="branch" 
          options={branchOptions} />
        </View>

        <TextField
          placeholder="Year"
          value="year"
        />

        <TextField
          placeholder="Semester"
          value="semester"
        />

        <TextField
          placeholder="Mobile No."
          value="mobile"
        />

        <TextField
          placeholder="Email"
          value="email"
        />

        <TextField
          placeholder="Parent Mobile 1"
          value="ParentMobile1"
        />

        <TextField
          placeholder="Parent Mobile 2"
          value="ParentMobile2"
        />

        <TextField
          placeholder="Parent Email"
          value="ParentEmail"
        />

        <TextField
          placeholder="Local Guardian Name"
          value="LocalGuardianName"
        />

        <TextField
          placeholder="Local Guardian Mobile"
          value="LocalGuardianMobile"
        />

        <TextField
          placeholder="Local Guardian Email"
          value="LocalGuardianEmail"
        />

        <TextField
          placeholder="Address"
          value="address"
        />

        <TextField
          placeholder="Room Number"
          value="roomNumber"
        />

      <Text className="text-lg font-semibold text-primary-300"> 
        Key Received ?
      </Text>
      <RadioField value="keyReceived" options={Options} />

      </View>

    </ScrollView>
  );
}

export default GeneralForm;
