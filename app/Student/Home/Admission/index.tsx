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
import PaymentPage from "@/components/admission/PaymentPage";

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
      case 4:
        return <PaymentPage />;
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
        if (page < 4) {
          next();
        } else {
          const output = {
            studentDetails: {
              name: values.name,
              rollNo: values.rollNo,
              course: values.course,
              branch: values.branch,
              semester: values.semester,
              mobile: values.mobile,
              email: values.email,
              emergencyContact: values.emergencyContact,
              dateOfBirth: values.dateOfBirth,
              age: values.age,
              nationality: values.nationality,
              govtId: values.govtId,
              admissionCategory: values.admissionCategory,
              bloodGroup: values.bloodGroup,
              medicalHistory: values.medicalHistory,
              hostelBlock: values.hostelBlock,
              previousResident: values.previousResident === "true" ? true : false,
              messPreference: values.messPreference
            },
            FatherDetails: {
              name: values.fatherName,
              occupation: values.fatherOccupation,
              mobile: values.fatherMobile,
              email: values.fatherEmail,
              country: values.fatherCountry
            },
            MotherDetails: {
              name: values.motherName,
              occupation: values.motherOccupation,
              mobile: values.motherMobile,
              email: values.motherEmail,
              country: values.motherCountry
            },
            ResidentialIndia: {
              houseNo: values.resIndiaHouseNo,
              street: values.resIndiaStreet,
              city: values.resIndiaCity,
              state: values.resIndiaState,
              country: values.resIndiaCountry,
              postalCode: values.resIndiaPostalCode
            },
            ResidentialForeign: {
              houseNo: values.resForeignHouseNo,
              street: values.resForeignStreet,
              city: values.resForeignCity,
              state: values.resForeignState,
              country: values.resForeignCountry,
              postalCode: values.resForeignPostalCode
            },
            localGuardian: {
              name: values.guardianName,
              relationship: values.guardianRelationship,
              mobile: values.guardianMobile,
              email: values.guardianEmail,
              address: {
                houseNo: values.guardianHouseNo,
                street: values.guardianStreet,
                city: values.guardianCity,
                state: values.guardianState,
                country: values.guardianCountry,
                postalCode: values.guardianPostalCode
              }
            },
            images: {
              passportPhoto: values.passportPhoto,
              studentSignature: values.studentSignature,
              parentGuardianSignature: values.parentGuardianSignature,
            },
            declaration: {
              studentAgreed: values.declaration.includes("studentAgreed"),
              parentAgreed: values.declaration.includes("parentAgreed"),
              submissionDate: getISTDateString(),
            },
            payment: {
              transactionId: values.transactionId
            }
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
                <ButtonText>{page === 4 ? "Submit" : "Next"}</ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default AdmissionForm;