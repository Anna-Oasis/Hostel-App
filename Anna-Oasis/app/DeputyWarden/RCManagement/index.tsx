import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";
import RCListTable from "@/components/rcmanagement/RCListTable";
import RCManagementForm from "@/components/rcmanagement/RCManagementForm";
import AssignFloorsModal from "@/components/rcmanagement/AssignFloorsModal";
import { initialRcList, floors , plusButtonStyles } from "@/constants/rcManagementValidation";
import { ActivityIndicator } from "react-native-paper";

export default function RCManagementPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRC, setSelectedRC] = useState<any>(null);
  const [selectedFloors, setSelectedFloors] = useState<string[]>([]);
  const [rcList, setRcList] = useState(initialRcList);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const openAssignModal = (rc: any) => {
    setSelectedRC(rc);
    setSelectedFloors(rc.assignedFloors || []);
    setModalVisible(true);
  };

  const closeAssignModal = () => {
    setModalVisible(false);
    setSelectedRC(null);
    setSelectedFloors([]);
  };

  const handleFloorToggle = (floor: string) => {
    setSelectedFloors((prev) =>
      prev.includes(floor)
        ? prev.filter((f) => f !== floor)
        : [...prev, floor]
    );
  };

  const handleAssign = () => {
    setRcList((prevList) =>
      prevList.map((rc) =>
        rc.id === selectedRC.id
          ? { ...rc, assignedFloors: selectedFloors }
          : rc
      )
    );
    closeAssignModal();
  };

  const handleAddRC = (formData: FormData) => {
    const newRC: any = {};
    formData.forEach((value, key) => {
      newRC[key] = value;
    });
    newRC.id = (rcList.length + 1).toString();
    newRC.assignedFloors = [];
    setRcList((prev) => [...prev, newRC]);
    setShowAddForm(false);
  };



    if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      {showAddForm ? (
        <RCManagementForm
    onSubmit={handleAddRC}
    onBack={() => setShowAddForm(false)}
    submitting={submitting}
  />
      ) : (
        <>
          <RCListTable rcList={rcList} onAssign={openAssignModal} />
          <TouchableOpacity
            style={plusButtonStyles.fab}
            onPress={() => setShowAddForm(true)}
          >
            <Plus color="#fff" size={28} />
          </TouchableOpacity>
        </>
      )}
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

