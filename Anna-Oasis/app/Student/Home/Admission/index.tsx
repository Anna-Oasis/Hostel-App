import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Formik } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import {initialValues} from "@/constants/admission";
import validationSchemas from "@/utils/admission/admissionValidation";
import StudentDetails from "@/components/admission/StudentDetails";
import ParentDetails from "@/components/admission/ParentDetails";
import LocalGuardian from "@/components/admission/LocalGuardian";
import HostelMessDeclaration from "@/components/admission/HostelMessDeclaration";

const AdmissionForm = () => {
  const [page, setPage] = useState(0);
  const next = () => setPage((p) => p + 1);
  const prev = () => setPage((p) => p - 1);

  const renderPage = () => {
    switch (page) {
      case 0:
        return <StudentDetails />;
      case 1:
        return <ParentDetails />;
      case 2:
        return <LocalGuardian />;
      case 3:
        return <HostelMessDeclaration />;
      default:
        return null;
    }
  };

  function getISTDateString() {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(
      now.getTime() + istOffset - now.getTimezoneOffset() * 60000
    );
    return istTime.toISOString().slice(0, 10);
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas[page]}
      onSubmit={(values) => {
        if (page < 3) {
          next();
        } else {
          const output = {
            studentDetails: {
              name: values.name,
              rollNo: values.rollNo,
              course: values.course,
              branch: values.branch,
              semester: values.semester,
              dateOfBirth: values.dateOfBirth,
              age: Number(values.age),
              mobile: values.mobile,
              email: values.email,
              admissionCategory: values.admissionCategory,
              bloodGroup: values.bloodGroup,
              medicalHistory: values.medicalHistory,
              previousResident:
                values.previousResident === "yes" ? true : false,
            },
            parentDetails: {
              fatherName: values.fatherName,
              fatherContact: {
                local: values.fatherContactLocal,
                foreign: values.fatherContactForeign,
              },
              motherName: values.motherName,
              motherContact: {
                local: values.motherContactLocal,
              },
              landline: values.landline,
              email: values.parentEmail,
              occupation: values.occupation,
              residentialAddress: values.residentialAddress,
              pin: values.pin,
            },
            localGuardian: {
              name: values.guardianName,
              occupation: values.guardianOccupation,
              residentialAddress: values.guardianResidentialAddress,
              pin: values.guardianPin,
              mobile: values.guardianMobile,
              landline: values.guardianLandline,
              email: values.guardianEmail,
            },
            images: {
              passportPhoto: values.passportPhoto,
              studentSignature: values.studentSignature,
              parentGuardianSignature: values.parentGuardianSignature,
            },
            hostelBlock: values.hostelBlock,
            roomNumber: values.roomNumber,
            messPreference: values.messPreference,
            declaration: {
              studentAgreed: values.declaration.includes("studentAgreed"),
              parentAgreed: values.declaration.includes("parentAgreed"),
              submissionDate: getISTDateString(),
            },
          };
          console.log(output);
        }
      }}
    >
      {({ handleSubmit }) => (
        <ScrollView>
          <View className="m-4 flex gap-3">
            {renderPage()}
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              {page > 0 && (
                <Button onPress={prev}>
                  <ButtonText>Back</ButtonText>
                </Button>
              )}
              <Button onPress={() => handleSubmit()}>
                <ButtonText>{page === 3 ? "Submit" : "Next"}</ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default AdmissionForm;
