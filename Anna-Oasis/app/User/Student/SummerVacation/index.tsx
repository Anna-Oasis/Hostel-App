import CheckBoxField from "@/components/form/CheckBoxField";
import DatePickerField from "@/components/form/DatePickerField";
import Label from "@/components/form/Label";
import PhoneInputField from "@/components/form/PhoneInputField";
import SelectField from "@/components/form/SelectField";
import TextField from "@/components/form/TextField";
import { Button, ButtonText } from "@/components/ui/button";
import { Formik } from "formik";
import { ScrollView } from "react-native";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Yup from 'yup';
import TimePickerField from "@/components/form/timePickerField";

export default function SummerVacationPage() {

  const degreeOptions: { label: string; value: string }[] = [
  { label: 'B.E', value: 'B.E' },
  { label: 'B.Tech', value: 'B.Tech' },
  { label: 'M.E', value: 'M.E' },
  { label: 'M.Tech', value: 'M.Tech' },
  { label: 'M.Sc', value: 'M.Sc' },
  { label: 'M.Phil', value: 'M.Phil' },
  { label: 'M.C.A', value: 'M.C.A' },
  { label: 'M.B.A', value: 'M.B.A' }
];


const programmeOptions: { label: string; value: string }[] = [
  { label: "Computer Science and Engineering", value: "Computer Science and Engineering" },
  { label: "Information Technology", value: "Information Technology" },
  { label: "Electronics and Communication Engineering", value: "Electronics and Communication Engineering" },
  { label: "Electrical and Electronics Engineering", value: "Electrical and Electronics Engineering" },
  { label: "Mechanical Engineering", value: "Mechanical Engineering" },
  { label: "Civil Engineering", value: "Civil Engineering" },
  { label: "Industrial Engineering", value: "Industrial Engineering" },
  { label: "Manufacturing Engineering", value: "Manufacturing Engineering" },
  { label: "Mining Engineering", value: "Mining Engineering" },
  { label: "Printing and Packaging Technology", value: "Printing and Packaging Technology" },
  { label: "Geo Informatics", value: "Geo Informatics" },
  { label: "Material Science and Engineering", value: "Material Science and Engineering" },
  { label: "Biomedical Engineering", value: "Biomedical Engineering" },
  { label: "M.Sc. IT (Integrated)", value: "M.Sc. IT (Integrated)" },
  { label: "M.Sc. Computer Science (Integrated)", value: "M.Sc. Computer Science (Integrated)" },
  { label: "Materials Science", value: "Materials Science" },
  { label: "Applied Chemistry", value: "Applied Chemistry" },
  { label: "Applied Mathematics", value: "Applied Mathematics" },
  { label: "Software Engineering", value: "Software Engineering" },
  { label: "Tourism Management", value: "Tourism Management" },
  { label: "Polymer Science and Engineering", value: "Polymer Science and Engineering" },
  { label: "Applied Geology", value: "Applied Geology" },
  { label: "Electronic Media", value: "Electronic Media" },
  { label: "Medical Physics", value: "Medical Physics" },
  { label: "Laser and Electro Optical Engineering", value: "Laser and Electro Optical Engineering" },
  { label: "Master of Business Administration", value: "Master of Business Administration" }
];



  const semesterOptions: { label: string; value: string }[] = [
    { label: 'Semester 1', value: '1' },
    { label: 'Semester 2', value: '2' },
    { label: 'Semester 3', value: '3' },
    { label: 'Semester 4', value: '4' },
    { label: 'Semester 5', value: '5' },
    { label: 'Semester 6', value: '6' },
    { label: 'Semester 7', value: '7' },
    { label: 'Semester 8', value: '8' },
    { label: 'Semester 9', value: '9' },
    { label: 'Semester 10', value: '10' },
  ];

  const hostelItemsOptions: { label: string; value: string }[] = [
  { label: "AC Remote", value: "AC Remote" },
  { label: "Room Keys", value: "Room Keys" },
  { label: "Lab Cable", value: "Lab Cable" },
  { label: "Cupboard Keys", value: "Cupboard Keys" },
];

const summerVacationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  roomno: Yup.string().required("Room number is required"),
  degree: Yup.string().required("Please select a degree"),
  programme: Yup.string().required("Please select a programme"),
  semester: Yup.string().required("Please select a semester"),
  vacationDate: Yup.string().required("Date of vacate is required"),
  vacationTime: Yup.string().required("Time of vacate is required"),
  address: Yup.string().required("Address is required"),
  mobileNumber: Yup.string()
    .matches(/^\+\d{1,3}[-\s]?\d{6,14}$/, "Enter a valid mobile number with country code")
    .required("Mobile number is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Parent's email is required"),
  lgmobileNumber: Yup.string()
    .matches(/^\+\d{1,3}[-\s]?\d{6,14}$/, "Enter a valid local guardian number with country code")
    .required("Local guardian number is required"),
  hostelItems: Yup.array()
    .min(1, "Please select at least one handed over item")
    .required("Please select at least one handed over item"),
  declaration: Yup.array()
    .min(1, "You must agree to the declaration before submitting")
    .required("You must agree to the declaration before submitting"),
});




  return (
    <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>        

        <View className="flex-1 justify-center p-4 items-center">
        
          <Text
            className="text-2xl font-semibold"
          >SummarVacation Form</Text>

          <View className="p-2">
            <Formik
              initialValues={{
                name: "",
                roomno: "",
                degree: "",
                programme: "",
                semester: "",
                vacationDate: "",             
                vacationTime: "",             
                address: "",
                mobileNumber: "",
                email: "",
                lgmobileNumber: "",
                hostelItems: [],               // for multiple checkbox values
                declaration: [],               // checkbox value stored as array
              }}
              validationSchema={summerVacationSchema}
              onSubmit={(values) => {
                console.log(values)
              }}
            >
              {({handleSubmit}) => (
                <View className="space-y-4">

                  <TextField 
                    label="Name" 
                    placeholder="Enter your name" 
                    value="name" 
                  />
                  
                  <TextField 
                    label="Room No" 
                    placeholder="Enter your room no" 
                    value="roomno" 
                  />
                  
                  <SelectField 
                    label="Degree" 
                    value="degree" 
                    options={degreeOptions}
                  />
                  
                  <SelectField 
                    label="Programme" 
                    value="programme" 
                    options={programmeOptions}
                  />

                  <SelectField 
                    label="Semester" 
                    value="semester" 
                    options={semesterOptions}
                  />

                  <DatePickerField 
                    minimumDate={new Date()} 
                    value="vacationDate" 
                    label="Date of Vacate"
                  />

                  <TimePickerField
                    value="vacationTime"
                    label="Time of Vacate"
                  />
                  

                  <TextField 
                    label="Address" 
                    value="address" 
                    placeholder="Address for future contact"
                  />

                  <PhoneInputField 
                    label="Mobile Number" 
                    placeholder="Enter Mobile Number" 
                    value="mobileNumber"
                  />

                  <TextField 
                    label="Parent's Email" 
                    value="email" 
                    placeholder="Enter Parent's Email"
                  />

                  <PhoneInputField 
                    label="Local Guardian Number" 
                    placeholder="Localguardian Number" 
                    value="lgmobileNumber"
                  />
            
                  <CheckBoxField
                    options={hostelItemsOptions}
                    value="hostelItems"
                    label="Did you handover all the items given by International Hostel ?"/>
            
                  <View className="p-4 flex items-center gap-2">
                    <Text
                      className="text-red-500"
                    >
                      Hereby, I acknowledge and declare that I leave the room without any damages upto the best of my knowledge. 
                      If the authorities find any further issues, I accept to pay the damage charges as per the hostel norms.
                    </Text>
                    <CheckBoxField 
                      value="declaration" 
                      options={[{label : 'I declare and agree with the hostel terms', value : 'decalre'}]}/>
                    </View>
                    <Button
                      onPress={() => handleSubmit()}
                    >
                      <ButtonText className="text-white font-semibold">SUBMIT</ButtonText>
                    </Button>
                </View>
              )}
            </Formik>
          </View>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}
