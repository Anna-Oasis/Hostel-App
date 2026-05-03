import { View, ScrollView, Alert } from "react-native";
import { useEffect, useState } from "react";
import {
  fetchStudentDetailsForVerification,
  updateStudentProfileApproval,
} from "@/utils/manager/managerDetailApi";
import ApprovalCard, { badgeStatus } from "@/components/ApprovalCard";
import useLoadingStore from "@/stores/loadingStore";
import EmptyPage from "@/components/EmptyPage";
import DeclineComment from "@/components/modals/DeclineComment";
import ModalCallable from "@/components/modals/ModalCallable";

const ProfileVerifications = () => {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedRollNo, setSelectedRollNo] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const data = await fetchStudentDetailsForVerification();
      setProfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setProfiles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleApprove = async (rollNo: string) => {
    setLoading(true);
    try {
      await updateStudentProfileApproval(true, rollNo, "Approved");
      await fetchProfiles();
      setSuccessMessage("Profile approved successfully!");
      setShowSuccessModal(true);
    } catch (e) {
      Alert.alert(
        "Error",
        "Failed to approve profile. Please try again later."
      );
    }
    setLoading(false);
  };

  const handleDecline = (rollNo: string) => {
    setSelectedRollNo(rollNo);
    setShowDeclineModal(true);
  };

  const handleDeclineSubmit = async (comment: string) => {
    setLoading(true);
    try {
      await updateStudentProfileApproval(false, selectedRollNo!, comment);
      setShowDeclineModal(false);
      setSelectedRollNo(null);
      await fetchProfiles();
      setSuccessMessage("Profile declined successfully!");
      setShowSuccessModal(true);
    } catch (e) {
      Alert.alert(
        "Error",
        "Failed to decline profile. Please try again later."
      );
    }
    setLoading(false);
  };

  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {profiles.length === 0 ? (
          <EmptyPage
            title="No pending verifications"
            description="All profiles have been reviewed."
          />
        ) : (
          profiles.map((profile) => (
            <ApprovalCard
              key={profile.id}
              title={`${profile.name} (${profile.rollNo})`}
              subTitle={`Course: ${profile.course}, Branch: ${profile.branch}`}
              badge={
                profile.approve === true
                  ? badgeStatus.Approved
                  : profile.approve === false
                  ? badgeStatus.Pending
                  : badgeStatus.Pending
              }
              data={profile}
              onApprove={() => handleApprove(profile.rollNo)}
              onDecline={() => handleDecline(profile.rollNo)}
              DeclineButtonTitle="Suggest changes"
            />
          ))
        )}
      </ScrollView>
      <DeclineComment
        visible={showDeclineModal}
        onClose={() => {
          setShowDeclineModal(false);
          setSelectedRollNo(null);
        }}
        onSubmit={handleDeclineSubmit}
        title="Decline Profile"
        placeholder="Enter reason for declining..."
        submitLabel="Decline"
        cancelLabel="Cancel"
      />
      <ModalCallable
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        message={successMessage}
      />
    </View>
  );
};

export default ProfileVerifications;
