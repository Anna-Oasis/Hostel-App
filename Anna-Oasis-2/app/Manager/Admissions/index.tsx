import { View, ScrollView, Alert, TextInput } from "react-native";
import { useEffect, useState } from "react";
import ApprovalCard from "@/components/ApprovalCard";
import useLoadingStore from "@/stores/loadingStore";
import EmptyPage from "@/components/EmptyPage";
import { getAdmissionsApprovedByManager } from "@/utils/manager/managerAdmissionApi";
import { getAdmissionBadgeStatus } from "@/utils/getBadgeStatus";
import { downloadFeeReceipt } from "@/utils/manager/managerFeeReceiptApi";

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

  const [searchRollNo, setSearchRollNo] = useState("");

  const filteredProfiles = admissions.filter((profile) =>
      profile.admission.roll_number
        ?.toString()
        .toLowerCase()
        .includes(searchRollNo.toLowerCase())
    );

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
            {filteredProfiles.map((profile) => (
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
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileVerifications;
