import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { floorModalStyles, spacing } from "@/constants/rcManagementValidation";
import { Trash2 } from "lucide-react-native";
import { ScrollView } from "react-native";

export default function RemoveRCModal({
  visible,
  rcList,
  onRemove,
  onCancel,
}: {
  visible: boolean;
  rcList: { id: string; name: string; hostel: string }[];
  onRemove: (rcId: string) => void;
  onCancel: () => void;
}) {
  const [removingId, setRemovingId] = useState<string | null>(null);

  const confirmRemove = (rcId: string, rcName: string) => {
    Alert.alert(
      "Remove RC",
      `Are you sure you want to remove "${rcName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setRemovingId(rcId);
            onRemove(rcId);
            setRemovingId(null);
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={floorModalStyles.modalOverlay}>
        <View style={[floorModalStyles.modalContent, { alignItems: "stretch" }]}>
          <Text style={floorModalStyles.modalTitle}>Remove RC</Text>

          <ScrollView style={{ maxHeight: 300 }}>
            {rcList.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#888" }}>No RCs available</Text>
            ) : (
              rcList.map((rc) => (
                <View
                  key={rc.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: spacing.sm,
                    borderBottomWidth: 1,
                    borderColor: "#eee",
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "bold" }}>{rc.name}</Text>
                    <Text style={{ color: "#666", fontSize: 12 }}>{rc.hostel}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => confirmRemove(rc.id, rc.name)}
                    disabled={removingId === rc.id}
                    style={{
                      padding: spacing.sm,
                      borderRadius: 20,
                      backgroundColor: "#fee2e2",
                    }}
                  >
                    <Trash2 color="#dc2626" size={20} />
                  </TouchableOpacity>
                </View>
              ))
            )}
            </ScrollView>
          <Button
            style={{ marginTop: spacing.lg, backgroundColor: "#eee" }}
            onPress={onCancel}
          >
            <ButtonText style={{ color: "#333" }}>Close</ButtonText>
          </Button>
        </View>
      </View>
    </Modal>
  );
}