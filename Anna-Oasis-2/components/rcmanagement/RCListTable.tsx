import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Pencil } from "lucide-react-native";
import { floorShort } from "@/constants/validations/rcManagementValidation";
import { Text } from "@/components/ui/text";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableData,
} from "@/components/ui/table";

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
    <Table className="w-full">
      <TableHeader>
        <TableRow className="bg-background-100">
          <TableHead>
            <Text className="text-base font-semibold">Name</Text>
          </TableHead>
          <TableHead >
            <Text className="text-base font-semibold">Hostel</Text>
          </TableHead>
          <TableHead>
            <Text className="text-base font-semibold">Floors</Text>
          </TableHead>
          <TableHead >
            <Text className="text-base font-semibold">Assign</Text>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rcList.map((item) => (
          <TableRow key={item.id}>
            <TableData>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className="text-base text-gray-900"
              >
                {item.name}
              </Text>
            </TableData>
            <TableData>
              <Text className="text-base text-gray-700">{item.hostel}</Text>
            </TableData>
            <TableData>
              <View className="flex-row flex-wrap">
                {item.assignedFloors.length > 0 ? (
                  item.assignedFloors.map((floor) => (
                    <View
                      key={floor}
                      className="bg-blue-600 rounded-md px-1 py-0.5 mr-1 mb-1 max-w-[48px] justify-center items-center"
                    >
                      <Text
                        className="text-white text-xs text-center"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {floorShort(floor)}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text className="text-gray-400">None</Text>
                )}
              </View>
            </TableData>
            <TableData >
              <TouchableOpacity
                onPress={() => onAssign(item)}
                accessibilityLabel="Assign Floors"
                className="rounded-full p-4 active:bg-blue-100"
                hitSlop={12}
              >
                <Pencil color="#2563eb" size={22} />
              </TouchableOpacity>
            </TableData>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}