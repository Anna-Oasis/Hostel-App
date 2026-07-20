import { View, ScrollView, Alert, TextInput } from "react-native";
import { useEffect, useState } from "react";
import ApprovalCard from "@/components/ApprovalCard";
import useLoadingStore from "@/stores/loadingStore";
import EmptyPage from "@/components/EmptyPage";
import { getAdmissionsApprovedByManager } from "@/utils/manager/managerAdmissionApi";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import { downloadFeeReceipt } from "@/utils/manager/managerFeeReceiptApi";
import { hostelBlocks, hostelBlockValues } from "@/constants/admission";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { downloadApplicationForm, downloadReAdmissionForm, downloadRoomAllotmentForm } from "@/utils/manager/managerFormsApi";

const ProfileVerifications = () => {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await getAdmissionsApprovedByManager();
      setAdmissions(Array.isArray(data) ? data : []);
      console.log(data)
    } catch (err) {
      setAdmissions([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const download = async (item : any) => {
      await downloadFeeReceipt(item.id, item.roll_number)
  }

  const downloadApplicationFormHelper = async (studentId : string) => {
      await downloadApplicationForm(studentId)
  }

  const downloadReadmissionFormHelper = async (studentId : string) => {
      await downloadReAdmissionForm(studentId)
  }

  const downloadRoomAllotmentFormHelper = async (studentId : string) => {
      await downloadRoomAllotmentForm(studentId)
  }

  const [searchRollNo, setSearchRollNo] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  const filteredProfiles = admissions.filter((profile) => {
    const rollMatch = profile.admission.roll_number
      ?.toString()
      .toLowerCase()
      .includes(searchRollNo.toLowerCase());

    const blockMatch =
      selectedBlock === null ||
      profile.admission.hostelBlock?.toString().toLowerCase() === selectedBlock.toLocaleLowerCase();

    return rollMatch && blockMatch;
  });

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {admissions.length === 0 ? (
          <EmptyPage
            title="No pending verifications"
            description="All admissions have been reviewed."
          />
        ) : (
          <>
            <TextInput
              placeholder="Search by Roll No"
              value={searchRollNo}
              onChangeText={setSearchRollNo}
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white w-full sm:w-[80%] md:w-[50%] self-center"
            />
            <View className="flex flex-row m-4 gap-4 self-center">
              <Button
                variant={selectedBlock === null ? "solid" : "outline"}
                onPress={() => setSelectedBlock(null)}
              >
                <ButtonText>All</ButtonText>
              </Button>

              {hostelBlockValues.map((block) => (
                  <Button 
                    key={block}
                    variant={selectedBlock === block ? "solid" : "outline"}
                    onPress={() => setSelectedBlock(block)}
                  >
                    <ButtonText>{block}</ButtonText>
                  </Button>
              ))}
            </View>
            {filteredProfiles.map((profile) => (
              <View className="flex">
                <ApprovalCard
                  key={profile.admission.id}
                  title={`${profile.student.name} (${profile.admission.roll_number})`}
                  subTitle={`Course: ${profile.student.course}, Branch: ${profile.student.branch}`}
                  badge={getAdmissionBadgeStatus(profile.admission.status)}
                  onDownload={() => download(profile.admission)}
                  downloadButton="Download Fee Receipt"
                  data={{
                    name : profile.student.name,
                    course : profile.student.course,
                    branch : profile.student.branch,
                    ...profile.admission
                  }}
                />
                <View className="flex flex-row self-center flex-wrap gap-4 m-4">
                  <Button
                    variant={selectedBlock === null ? "solid" : "outline"}
                    onPress={() => downloadApplicationFormHelper(profile.student.user_id)}
                  >
                    <ButtonText>Application Form</ButtonText>
                  </Button>
                  <Button
                    variant={selectedBlock === null ? "solid" : "outline"}
                    onPress={() => downloadReadmissionFormHelper(profile.student.user_id)}
                  >
                    <ButtonText>Readmission Form</ButtonText>
                  </Button>
                  <Button
                    variant={selectedBlock === null ? "solid" : "outline"}
                    onPress={() => downloadRoomAllotmentFormHelper(profile.student.user_id)}
                  >
                    <ButtonText>Room Allotment</ButtonText>
                  </Button>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileVerifications;
