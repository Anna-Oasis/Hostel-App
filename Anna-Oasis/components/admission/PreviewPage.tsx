import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { useFormikContext } from "formik";
import { Button, ButtonText } from "@/components/ui/button";

const PreviewPage = ({ onEdit, onSubmit }: { onEdit: () => void; onSubmit: () => void }) => {
  const { values } = useFormikContext<any>();

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>Student Details</Text>
      <Text>Name: {values.name}</Text>
      <Text>Roll No: {values.rollNo}</Text>
      <Text>Course: {values.course}</Text>
      <Text>Branch: {values.branch}</Text>
      <Text>Semester: {values.semester}</Text>
      <Text>Mobile: {values.mobile}</Text>
      <Text>Email: {values.email}</Text>
      <Text>Emergency Contact: {values.emergencyContact}</Text>
      <Text>Date of Birth: {values.dateOfBirth}</Text>
      <Text>Age: {values.age}</Text>
      <Text>Nationality: {values.nationality}</Text>
      <Text>Govt ID: {values.govtId}</Text>
      <Text>Admission Category: {values.admissionCategory}</Text>
      <Text>Blood Group: {values.bloodGroup}</Text>
      <Text>Medical History: {values.medicalHistory}</Text>
      <Text>Hostel Block: {values.hostelBlock}</Text>
      <Text>Previous Resident: {values.previousResident}</Text>
      <Text>Mess Preference: {values.messPreference}</Text>

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 16, marginBottom: 8 }}>Father Details</Text>
      <Text>Name: {values.fatherName}</Text>
      <Text>Occupation: {values.fatherOccupation}</Text>
      <Text>Mobile: {values.fatherMobile}</Text>
      <Text>Email: {values.fatherEmail}</Text>
      <Text>Country: {values.fatherCountry}</Text>

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 16, marginBottom: 8 }}>Mother Details</Text>
      <Text>Name: {values.motherName}</Text>
      <Text>Occupation: {values.motherOccupation}</Text>
      <Text>Mobile: {values.motherMobile}</Text>
      <Text>Email: {values.motherEmail}</Text>
      <Text>Country: {values.motherCountry}</Text>

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 16, marginBottom: 8 }}>Residential Address (India)</Text>
      <Text>House No: {values.resIndiaHouseNo}</Text>
      <Text>Street: {values.resIndiaStreet}</Text>
      <Text>City: {values.resIndiaCity}</Text>
      <Text>State: {values.resIndiaState}</Text>
      <Text>Country: {values.resIndiaCountry}</Text>
      <Text>Postal Code: {values.resIndiaPostalCode}</Text>

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 16, marginBottom: 8 }}>Residential Address (Foreign)</Text>
      <Text>House No: {values.resForeignHouseNo}</Text>
      <Text>Street: {values.resForeignStreet}</Text>
      <Text>City: {values.resForeignCity}</Text>
      <Text>State: {values.resForeignState}</Text>
      <Text>Country: {values.resForeignCountry}</Text>
      <Text>Postal Code: {values.resForeignPostalCode}</Text>

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 16, marginBottom: 8 }}>Local Guardian</Text>
      <Text>Name: {values.guardianName}</Text>
      <Text>Relationship: {values.guardianRelationship}</Text>
      <Text>Mobile: {values.guardianMobile}</Text>
      <Text>Email: {values.guardianEmail}</Text>
      <Text>Address: {`${values.guardianHouseNo}, ${values.guardianStreet}, ${values.guardianCity}, ${values.guardianState}, ${values.guardianCountry}, ${values.guardianPostalCode}`}</Text>

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 16, marginBottom: 8 }}>Images</Text>
      <Text>Passport Photo:</Text>
      {values.passportPhoto ? (
        <Image source={{ uri: values.passportPhoto }} style={{ width: 100, height: 100 }} />
      ) : (
        <Text>Not uploaded</Text>
      )}
      <Text>Student Signature:</Text>
      {values.studentSignature ? (
        <Image source={{ uri: values.studentSignature }} style={{ width: 100, height: 50 }} />
      ) : (
        <Text>Not uploaded</Text>
      )}
      <Text>Parent/Guardian Signature:</Text>
      {values.parentGuardianSignature ? (
        <Image source={{ uri: values.parentGuardianSignature }} style={{ width: 100, height: 50 }} />
      ) : (
        <Text>Not uploaded</Text>
      )}

      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 16, marginBottom: 8 }}>Declaration</Text>
      <Text>Student Agreed: {values.declaration?.includes("studentAgreed") ? "Yes" : "No"}</Text>
      <Text>Parent Agreed: {values.declaration?.includes("parentAgreed") ? "Yes" : "No"}</Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 24 }}>
        <Button onPress={onEdit}>
          <ButtonText>Edit</ButtonText>
        </Button>
        <Button onPress={onSubmit}>
          <ButtonText>Submit</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default PreviewPage;