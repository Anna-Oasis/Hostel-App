import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Plus, Trash2 } from "lucide-react-native";
import RCListTable from "@/components/rcmanagement/RCListTable";
import RCManagementForm from "@/components/rcmanagement/RCManagementForm";
import AssignFloorsModal from "@/components/rcmanagement/AssignFloorsModal";
import RemoveRCModal from "@/components/rcmanagement/RemoveRCModal";
import { Spinner } from "@/components/ui/spinner";
import { floors } from "@/constants/validations/rcManagementValidation";
import {
  fetchRCs,
  addRC,
  removeRC,
  assignFloors,
} from "@/utils/rcManagement/RCManagementUtils";

export default function RCManagementPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRC, setSelectedRC] = useState<any>(null);
  const [selectedFloors, setSelectedFloors] = useState<string[]>([]);
  const [rcList, setRcList] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);

  // Fetch RCs from backend
  const handleFetchRCs = async () => {
    setLoading(true);
    try {
      const data = await fetchRCs();
      setRcList(data);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to fetch RCs");
      setRcList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    handleFetchRCs();
  }, []);

  // Remove RC
  const handleRemoveRC = async (rcId: string) => {
    setSubmitting(true);
    try {
      await removeRC(rcId);
      setRcList((prev) => prev.filter((rc) => rc.id !== rcId));
      setRemoveModalVisible(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to remove RC.");
    }
    setSubmitting(false);
  };

  // Assign Floors Modal
  const openAssignModal = (rc: any) => {
    setSelectedRC(rc);
    setSelectedFloors(rc.floor || []);
    setModalVisible(true);
  };

  const closeAssignModal = () => {
    setModalVisible(false);
    setSelectedRC(null);
    setSelectedFloors([]);
  };

  const handleFloorToggle = (floor: string) => {
    setSelectedFloors((prev) =>
      prev.includes(floor) ? prev.filter((f) => f !== floor) : [...prev, floor]
    );
  };

  // Assign Floors API
  const handleAssign = async () => {
    if (!selectedRC) return;
    setSubmitting(true);
    try {
      const floorNumbers = selectedFloors.map(floor => floors.indexOf(floor));
      await assignFloors(selectedRC.id, {
        name: selectedRC.name,
        hostel: selectedRC.hostel,
        floor: floorNumbers,
      });
      setRcList((prevList) =>
        prevList.map((rc) =>
          rc.id === selectedRC.id ? { ...rc, floor: selectedFloors } : rc
        )
      );
      closeAssignModal();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to assign floors.");
    }
    setSubmitting(false);
  };

  // Add RC API
  const handleAddRC = async (formData: FormData) => {
    setSubmitting(true);
    try {
      const newRC = await addRC(formData);
      setRcList((prev) => [...prev, newRC]);
      setShowAddForm(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to add RC.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Spinner size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      {showAddForm ? (
        <RCManagementForm
          onSubmit={handleAddRC}
          onBack={() => setShowAddForm(false)}
          submitting={submitting}
        />
      ) : (
        <>
          <ScrollView>
            <RCListTable
              rcList={rcList.map((rc) => ({
                ...rc,
                assignedFloors: rc.floor || [],
              }))}
              onAssign={openAssignModal}
            />
          </ScrollView>
          <TouchableOpacity
            className="absolute right-10 bottom-10 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
            onPress={() => setShowAddForm(true)}
          >
            <Plus color="#fff" size={28} />
          </TouchableOpacity>
        </>
      )}
      {!showAddForm && (
        <TouchableOpacity
          className="absolute left-10 bottom-10 bg-red-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
          onPress={() => setRemoveModalVisible(true)}
        >
          <Trash2 color="#fff" size={28} />
        </TouchableOpacity>
      )}
      <RemoveRCModal
        visible={removeModalVisible}
        rcList={rcList}
        onRemove={handleRemoveRC}
        onCancel={() => setRemoveModalVisible(false)}
      />
      <AssignFloorsModal
        visible={modalVisible}
        rc={selectedRC}
        floors={floors}
        selectedFloors={selectedFloors}
        onToggleFloor={handleFloorToggle}
        onAssign={handleAssign}
        onCancel={closeAssignModal}
        submitting={submitting}
      />
    </View>
  );
}