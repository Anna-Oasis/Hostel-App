import { ScrollView, View,Text } from "react-native";
import TextField from "@/components/form/TextField";
import RadioField from "@/components/form/RadioField";
import SelectField from "@/components/form/SelectField";

const courseOptions = [
  { label: "course1", value: "course1" },
  { label: "course2", value: "course2" },
  { label: "course3", value: "course3" },
];

const branchOptions = [
  { label: "Information Technology", value: "Information Technology" },
  { label: "Geoinformatics", value: "Geoinformatics" },
  { label: "Printing", value: "Printing" },
];

function GeneralForm() {
  return (
    <ScrollView>
      <View>
      <RadioField
              value="hostelBlock"
              options={[{ label: "Flora (Boys)", value: "Flora" }, { label: "Lavender (Girls)", value: "Lavender" }]}
            />
            <TextField
              placeholder="Name"
              value="name"
            />

            <Text> Course</Text>
            <SelectField
             value="course" 
             options={courseOptions} />

            <Text> Branch</Text> 
            <SelectField 
             value="branch" 
             options={branchOptions} />

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
      </View>
    </ScrollView>
  );
}

export default GeneralForm;
