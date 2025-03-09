import { ScrollView, View } from "react-native";
import TextField from "@/components/form/TextField";
import RadioField from "@/components/form/RadioField";

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
            <TextField
              placeholder="Course"
              value="course"
            />
            <TextField
              placeholder="Branch"
              value="branch"
            />
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
              value="parentsContact.mobile1"
            />
            <TextField
              placeholder="Parent Mobile 2"
              value="parentsContact.mobile2"
            />
            <TextField
              placeholder="Parent Email"
              value="parentsContact.email"
            />
            <TextField
              placeholder="Local Guardian Name"
              value="localGuardian.name"
            />
            <TextField
              placeholder="Local Guardian Mobile"
              value="localGuardian.mobile"
            />
            <TextField
              placeholder="Local Guardian Email"
              value="localGuardian.email"
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
