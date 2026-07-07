import { View, ScrollView, Alert, TextInput } from "react-native";
import { useEffect, useState } from "react";
import ApprovalCard from "@/components/ApprovalCard";
import useLoadingStore from "@/stores/loadingStore";
import EmptyPage from "@/components/EmptyPage";
import { getAllRCStudents } from "@/utils/rc/RcAttendenceUtils";

const ProfileVerifications = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await getAllRCStudents();
      setProfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setProfiles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);



  const [searchRollNo, setSearchRollNo] = useState("");

  const filteredProfiles = profiles.filter((profile) =>
      profile.rollNo
        ?.toString()
        .toLowerCase()
        .includes(searchRollNo.toLowerCase())
    );

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {profiles.length === 0 ? (
          <EmptyPage
            title="No pending verifications"
            description="All profiles have been reviewed."
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
                key={profile.id}
                title={`${profile.name} (${profile.rollNo})`}
                subTitle={`Course: ${profile.course}, Branch: ${profile.branch}`}
                data={profile}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileVerifications;