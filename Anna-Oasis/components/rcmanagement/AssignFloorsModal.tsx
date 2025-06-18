import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { Checkbox, CheckboxIndicator, CheckboxLabel, CheckboxIcon } from "@/components/ui/checkbox";
import { floorModalStyles } from "@/constants/rcManagementValidation";

export default function AssignFloorsModal({
  visible,
  rc,
  floors,
  selectedFloors,
  onToggleFloor,
  onAssign,
  onCancel,
  submitting,
}: {
  visible: boolean;
  rc: any;
  floors: string[];
  selectedFloors: string[];
  onToggleFloor: (floor: string) => void;
  onAssign: () => void;
  onCancel: () => void;
  submitting?: boolean;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={floorModalStyles.modalOverlay}>
        <View style={floorModalStyles.modalContent}>
          <Text style={floorModalStyles.modalTitle}>
            Assign Floors to {rc?.name}
          </Text>
          <View style={{ width: "100%" }}>
            {floors.map((floor) => (
              <TouchableOpacity
                key={floor}
                style={floorModalStyles.floorItem}
                activeOpacity={0.7}
                onPress={() => onToggleFloor(floor)}
              >
                <Checkbox
                  value={floor}
                  isChecked={selectedFloors.includes(floor)}
                  onChange={() => onToggleFloor(floor)}
                  size="md"
                >
                  <CheckboxIndicator>
                    <CheckboxIcon />
                  </CheckboxIndicator>
                  <CheckboxLabel style={{ marginLeft: 8 }}>{floor}</CheckboxLabel>
                </Checkbox>
              </TouchableOpacity>
            ))}
          </View>
          <Button style={{ marginTop: 16 }} onPress={onAssign} disabled={submitting}>
            <ButtonText>{submitting ? "Assigning..." : "Assign"}</ButtonText>
          </Button>
          <Button
            style={{ marginTop: 8, backgroundColor: "#eee" }}
            onPress={onCancel}
          >
            <ButtonText style={{ color: "#333" }}>Cancel</ButtonText>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

