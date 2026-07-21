import { View, ScrollView, Alert, TextInput, Text } from "react-native";
import { useEffect, useState } from "react";
import useLoadingStore from "@/stores/loadingStore";
import { Button, ButtonText } from "@/components/ui/button";
import { deleteStudentAdmission, deleteStudentProfile } from "@/utils/manager/managerDeletionApi";
import EmptyPage from "@/components/EmptyPage";

const DataDeletion = () => {
    const setLoading = useLoadingStore((state) => state.setLoading);

    const [searchRollNo, setSearchRollNo] = useState("");
        const [confirmation, setConfirmation] = useState("");

    const isConfirmed = confirmation.trim().toUpperCase() === "DELETE";

    const deleteProfile = async() => {
        if(searchRollNo.trim() === "") return
        console.log(searchRollNo.trim())
        await deleteStudentProfile(searchRollNo.trim())
    }

    const deleteAdmission = async() => {
        if(searchRollNo.trim() === "") return
        console.log(searchRollNo.trim())
        await deleteStudentAdmission(searchRollNo.trim())
    }

    

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Roll Number Search */}
        <TextInput
          placeholder="Search by Roll No"
          value={searchRollNo}
          onChangeText={setSearchRollNo}
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white w-full sm:w-[80%] md:w-[50%] self-center"
        />

        {searchRollNo ? (
          <View className="self-center w-full sm:w-[80%] md:w-[50%]">

            {/* Warning */}
            <View className="bg-red-100 border border-red-300 rounded-lg p-4 mb-5">
              <Text className="text-red-700 font-bold text-lg">
                ⚠ Danger Zone
              </Text>

              <Text className="text-red-600 mt-2">
                Deleting a profile or admission is permanent and cannot be
                undone.
              </Text>

              <Text className="mt-4 font-semibold">
                Type <Text className="font-bold">DELETE</Text> to confirm
              </Text>

              <TextInput
                value={confirmation}
                onChangeText={setConfirmation}
                placeholder="Type DELETE"
                autoCapitalize="characters"
                className="border border-red-300 rounded-lg px-4 py-3 mt-3 bg-white"
              />
            </View>

            {/* Buttons */}
            <View className="gap-4">
              <Button
                isDisabled={!isConfirmed}
                className={!isConfirmed ? "opacity-50" : ""}
                onPress={deleteProfile}
              >
                <ButtonText>Delete Profile</ButtonText>
              </Button>

              <Button
                isDisabled={!isConfirmed}
                className={!isConfirmed ? "opacity-50" : ""}
                onPress={deleteAdmission}
              >
                <ButtonText>Delete Admission</ButtonText>
              </Button>
            </View>
          </View>
        ) : 
            <EmptyPage
                    title="Data Deletion page"
                    description="Enter Roll number to delete Student Profile or Admission"
            />
        }
      </ScrollView>
    </View>
  );
};

export default DataDeletion;
