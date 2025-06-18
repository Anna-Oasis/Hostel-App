import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";
import { floordisplayStyles } from "@/constants/rcManagementValidation";
import { Pencil } from "lucide-react-native"; 
import { floorShort } from "@/constants/rcManagementValidation";


export default function RCListTable({
  rcList,
  onAssign,
}: {
  rcList: {
    id: string;
    name: string;
    hostel: string;
    assignedFloors: string[];
  }[];
  onAssign: (rc: any) => void;
}) {
  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title style={{ flex: 1.4 }}>
          <Text numberOfLines={2} style={{ flexWrap: "wrap" }}>
            Name
          </Text>
        </DataTable.Title>
        <DataTable.Title style={{ flex: 1 }}>Hostel</DataTable.Title>
        <DataTable.Title style={{ flex: 1 }}>Floors</DataTable.Title>
        <DataTable.Title style={{ flex: 0.5 }}>Assign</DataTable.Title>
      </DataTable.Header>
      {rcList.map((item) => (
        <DataTable.Row key={item.id}>
          <DataTable.Cell style={{ flex: 1.3 }}>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ flexWrap: "wrap" }}
            >
              {item.name}
            </Text>
          </DataTable.Cell>
          <DataTable.Cell style={{ flex: 1.05 }}>{item.hostel}</DataTable.Cell>
          <DataTable.Cell style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {item.assignedFloors.length > 0 ? (
                item.assignedFloors.map((floor) => (
                  <View key={floor} style={floordisplayStyles.badge}>
                    <Text
                      style={{ color: "#fff", fontSize: 12 }}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {floorShort(floor)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: "#888" }}>None</Text>
              )}
            </View>
          </DataTable.Cell>
          <DataTable.Cell style={{ flex: 0.4, alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => onAssign(item)} accessibilityLabel="Assign Floors">
              <Pencil color="#2563eb" size={22} />
            </TouchableOpacity>
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
}