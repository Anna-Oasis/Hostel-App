import { View, Text } from "react-native";
import React from "react";
import { FileText, Info } from "lucide-react-native";

export default function HostelVacationPage() {
  return (
    <View className="flex-1 justify-center items-center px-5 bg-gray-50">
      <View className="mb-8 p-6 bg-white rounded-full shadow">
        <FileText size={80} color="#2980b9" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Hostel Vacation Feature Coming Soon
      </Text>
      <View className="flex-row items-center mb-4 space-x-2">
        <Info size={24} color="#27ae60" />
        <Text className="text-lg text-green-600 font-semibold">
          Under Development
        </Text>
      </View>
      <Text className="text-base text-gray-500 text-center leading-6 mb-8">
        The hostel vacation and vacating form feature will be available in a
        future update. Soon, you will be able to submit your hostel vacation
        request and view your history here.
      </Text>
      <View className="bg-white p-5 rounded-xl w-full max-w-xs shadow">
        <View className="flex-row items-center space-x-3">
          <Info size={20} color="#2980b9" />
          <Text className="text-sm text-gray-600 flex-1">
            Stay tuned for updates in upcoming releases.
          </Text>
        </View>
      </View>
    </View>
  );
}

// import { useState, useRef } from "react";
// import { View, ScrollView } from "react-native";
// import { Formik } from "formik";
// import VacatingForm from "@/components/hostelvacation/VacatingForm";
// import CautionDepositForm from "@/components/hostelvacation/CautionDepositForm";
// import { initialValues as vacateInitialValues } from "@/constants/vacatingHostels";
// import { initialValues as depositInitialValues, validationSchema as depositValidationSchema } from "@/constants/validations/cautionDepositValidation";
// import { validationSchema as vacateValidationSchema } from "@/constants/validations/vacatingHostelValidation";
// import { submitStudentVacatingForm } from "@/utils/student/studentVacatingHostelApi";
// import useUserStore from "@/stores/userStore";
// import TabSwitch from "@/components/TabSwitch";
// import HostelVacationHistory from "@/components/hostelvacation/HostelVacationHistory";
// import { FilePlus2, History } from "lucide-react-native";
// import ModalCallable from "@/components/modals/ModalCallable";
// import { Button, ButtonText } from "@/components/ui/button";

// const initialValues = {
//   ...vacateInitialValues,
//   ...depositInitialValues,
// };

// const validationSchemas = [
//   vacateValidationSchema,
//   depositValidationSchema,
// ];

// export default function HostelVacationPage() {
//   const [page, setPage] = useState(0);
//   const [activeTab, setActiveTab] = useState<"form" | "history">("form");
//   const [showSuccess, setShowSuccess] = useState(false);
//   const details = useUserStore((state) => state.details);
//   const scrollViewRef = useRef<ScrollView>(null);

//   const next = () => {
//     setPage((p) => p + 1);
//     setTimeout(() => {
//       scrollViewRef.current?.scrollTo({ y: 0, animated: true });
//     }, 0);
//   };
//   const prev = () => setPage((p) => p - 1);

//   const handleModalClose = () => {
//     setShowSuccess(false);
//     setActiveTab("history");
//     setPage(0);
//   };

//   const renderPage = () => {
//     switch (page) {
//       case 0:
//         return <VacatingForm />;
//       case 1:
//         return <CautionDepositForm />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: "#fff" }}>
//       <TabSwitch
//         tabs={[
//           { label: "Vacation Form", value: "form" },
//           { label: "History", value: "history" },
//         ]}
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//         icons={{
//           form: FilePlus2,
//           history: History,
//         }}
//         className="mt-4 mb-2"
//       />
//       {activeTab === "form" ? (
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchemas[page]}
//           onSubmit={async (values, formikHelpers) => {
//             if (page < 1) {
//               next();
//             } else {
//               const roll_number = details?.rollNo || "";
//               const vacatingValues = {
//                 vacating_date: values.vacating_date,
//                 vacating_time: values.vacating_time,
//                 future_address: values.future_address,
//                 returned_items: values.returned_items,
//                 endeavour: values.endeavour,
//                 endeavourDescription: values.endeavourDescription,
//                 feedback: values.feedback,
//               };
//               const cautionDepositValues = {
//                 accountHolderName: values.accountHolderName,
//                 accountNumber: values.accountNumber,
//                 bankName: values.bankName,
//                 addressOfTheBank: values.addressOfTheBank,
//                 IFSCode: values.IFSCode,
//               };
//               const success = await submitStudentVacatingForm(roll_number, vacatingValues, cautionDepositValues);
//               if (success) {
//                 setShowSuccess(true);
//               }
//             }
//           }}
//         >
//           {({handleSubmit, errors}
//           ) => (
//             <ScrollView ref={scrollViewRef}>
//               <View className="m-4 flex gap-3">
//                 {renderPage()}
//                 <View className="flex-row justify-between">
//                   {page < 1 && (
//                     <>
//                       <Button onPress={() => {
//                         console.log("Current Formik errors:", errors);
//                         handleSubmit();
//                       }}>
//                         <ButtonText>Next</ButtonText>
//                       </Button>
//                     </>
//                   )}
//                   {page === 1 && (
//                     <>
//                       <Button onPress={prev}>
//                         <ButtonText>Back</ButtonText>
//                       </Button>
//                       <Button onPress={() => {
//                         console.log("Current Formik errors:", errors);
//                         handleSubmit();
//                       }}>
//                         <ButtonText>Submit</ButtonText>
//                       </Button>
//                     </>
//                   )}
//                 </View>
//               </View>
//             </ScrollView>
//           )}
//         </Formik>
//       ) : (
//         <HostelVacationHistory />
//       )}
//       <ModalCallable
//         show={showSuccess}
//         onClose={handleModalClose}
//         title="Success"
//         message="Your hostel vacation form has been submitted successfully."
//       />
//     </View>
//   );
// }
