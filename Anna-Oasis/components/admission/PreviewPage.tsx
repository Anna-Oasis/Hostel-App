import React from "react";
import { ScrollView, Image, View } from "react-native";
import { useFormikContext } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableData,
} from "@/components/ui/table";

const PreviewPage = ({ onEdit, onSubmit }: { onEdit: () => void; onSubmit: () => void }) => {
  const { values } = useFormikContext<any>();

  const renderImage = (uri: string | undefined, style?: any) =>
    uri ? (
      <Image source={{ uri }} style={[{ width: 100, height: 60 }, style]} />
    ) : (
      "Not uploaded"
    );

  return (
    <ScrollView className="p-4">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Student Details */}
          <TableRow>
            <TableData>Name</TableData>
            <TableData>{values.name}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Roll No</TableData>
            <TableData>{values.rollNo}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Course</TableData>
            <TableData>{values.course}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Branch</TableData>
            <TableData>{values.branch}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Semester</TableData>
            <TableData>{values.semester}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Mobile</TableData>
            <TableData>{values.mobile}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Email</TableData>
            <TableData>{values.email}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Emergency Contact</TableData>
            <TableData>{values.emergencyContact}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Date of Birth</TableData>
            <TableData>{values.dateOfBirth}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Age</TableData>
            <TableData>{values.age}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Nationality</TableData>
            <TableData>{values.nationality}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Govt ID</TableData>
            <TableData>{values.govtId}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Admission Category</TableData>
            <TableData>{values.admissionCategory}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Blood Group</TableData>
            <TableData>{values.bloodGroup}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Medical History</TableData>
            <TableData>{values.medicalHistory}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Hostel Block</TableData>
            <TableData>{values.hostelBlock}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Previous Resident</TableData>
            <TableData>{values.previousResident}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Mess Preference</TableData>
            <TableData>{values.messPreference}</TableData>
          </TableRow>
          {/* Father Details */}
          <TableRow>
            <TableData>Father Name</TableData>
            <TableData>{values.fatherName}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Father Occupation</TableData>
            <TableData>{values.fatherOccupation}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Father Mobile</TableData>
            <TableData>{values.fatherMobile}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Father Email</TableData>
            <TableData>{values.fatherEmail}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Father Country</TableData>
            <TableData>{values.fatherCountry}</TableData>
          </TableRow>
          {/* Mother Details */}
          <TableRow>
            <TableData>Mother Name</TableData>
            <TableData>{values.motherName}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Mother Occupation</TableData>
            <TableData>{values.motherOccupation}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Mother Mobile</TableData>
            <TableData>{values.motherMobile}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Mother Email</TableData>
            <TableData>{values.motherEmail}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Mother Country</TableData>
            <TableData>{values.motherCountry}</TableData>
          </TableRow>
          {/* Residential India */}
          <TableRow>
            <TableData>India House No</TableData>
            <TableData>{values.resIndiaHouseNo}</TableData>
          </TableRow>
          <TableRow>
            <TableData>India Street</TableData>
            <TableData>{values.resIndiaStreet}</TableData>
          </TableRow>
          <TableRow>
            <TableData>India City</TableData>
            <TableData>{values.resIndiaCity}</TableData>
          </TableRow>
          <TableRow>
            <TableData>India State</TableData>
            <TableData>{values.resIndiaState}</TableData>
          </TableRow>
          <TableRow>
            <TableData>India Country</TableData>
            <TableData>{values.resIndiaCountry}</TableData>
          </TableRow>
          <TableRow>
            <TableData>India Postal Code</TableData>
            <TableData>{values.resIndiaPostalCode}</TableData>
          </TableRow>
          {/* Residential Foreign */}
          <TableRow>
            <TableData>Foreign House No</TableData>
            <TableData>{values.resForeignHouseNo}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Foreign Street</TableData>
            <TableData>{values.resForeignStreet}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Foreign City</TableData>
            <TableData>{values.resForeignCity}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Foreign State</TableData>
            <TableData>{values.resForeignState}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Foreign Country</TableData>
            <TableData>{values.resForeignCountry}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Foreign Postal Code</TableData>
            <TableData>{values.resForeignPostalCode}</TableData>
          </TableRow>
          {/* Local Guardian */}
          <TableRow>
            <TableData>Guardian Name</TableData>
            <TableData>{values.guardianName}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Guardian Relationship</TableData>
            <TableData>{values.guardianRelationship}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Guardian Mobile</TableData>
            <TableData>{values.guardianMobile}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Guardian Email</TableData>
            <TableData>{values.guardianEmail}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Guardian Address</TableData>
            <TableData>{`${values.guardianHouseNo}, ${values.guardianStreet}, ${values.guardianCity}, ${values.guardianState}, ${values.guardianCountry}, ${values.guardianPostalCode}`}</TableData>
          </TableRow>
          {/* Images */}
          <TableRow>
            <TableData>Passport Photo</TableData>
            <TableData>{renderImage(values.passportPhoto)}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Student Signature</TableData>
            <TableData>{renderImage(values.studentSignature, { height: 50 })}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Parent/Guardian Signature</TableData>
            <TableData>{renderImage(values.parentGuardianSignature, { height: 50 })}</TableData>
          </TableRow>
          {/* Declaration */}
          <TableRow>
            <TableData>Student Agreed</TableData>
            <TableData>{values.declaration?.includes("studentAgreed") ? "Yes" : "No"}</TableData>
          </TableRow>
          <TableRow>
            <TableData>Parent Agreed</TableData>
            <TableData>{values.declaration?.includes("parentAgreed") ? "Yes" : "No"}</TableData>
          </TableRow>
          {/* Payment */}
          <TableRow>
            <TableData>Transaction ID</TableData>
            <TableData>{values.transactionId}</TableData>
          </TableRow>
        </TableBody>
      </Table>
      <View className="flex-row justify-between mt-6">
        <Button onPress={onEdit}>
          <ButtonText>Back to form</ButtonText>
        </Button>
        <Button onPress={onSubmit}>
          <ButtonText>Submit</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
};

export default PreviewPage;