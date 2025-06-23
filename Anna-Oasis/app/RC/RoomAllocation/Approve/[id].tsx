import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import useRCStore from "@/stores/rcStore";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { allocateRoomAdmission } from "@/utils/rc/rcAdmissionApi";
import useLoadingStore from "@/stores/loadingStore";

const ApprovePage = () => {
  const { id } = useLocalSearchParams();
  const rooms = useRCStore((state) => state.rooms);
  const hostelBlock = useRCStore((state) => state.hostelBlock);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(
    rooms.length > 0 ? 0 : null
  );
  const [selectedRoom, setSelectedRoom] = useState<{
    roomNumber: number;
    floor: number;
  } | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);
  const handleFloorChange = (value: string) => {
    setSelectedFloor(Number(value));
    setSelectedRoom(null);
  };

  const handleRoomSelect = (roomNumber: number) => {
    if (selectedFloor !== null) {
      setSelectedRoom({ roomNumber, floor: selectedFloor });
    }
  };

  const handleAllocation = async () => {
    if (!selectedRoom) return;
    setLoading(true);
    try {
      await allocateRoomAdmission(id as string, {
        approve: true,
        comment: "Approved",
        room: selectedRoom.roomNumber,
        floor: selectedRoom.floor,
        hostel_block: hostelBlock,
      });
      Alert.alert("Success", "Room Allocated successfully");
      router.replace("/RC/RoomAllocation");
    } catch (error: any) {
      Alert.alert(
        "Update Error",
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while updating the admission"
      );
      console.log("Error allocating room:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView className="flex-1">
        <Text className="text-xl font-bold mb-4">
          Approve Room Allocation - {id}
        </Text>
        <View className="mb-4">
          <Select
            selectedValue={
              selectedFloor !== null ? String(selectedFloor) : undefined
            }
            onValueChange={handleFloorChange}
          >
            <SelectTrigger variant="outline" size="md" className="w-full">
              <SelectInput placeholder="Select Floor" />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {rooms.map((_, idx) => (
                  <SelectItem
                    key={idx}
                    label={`Floor ${idx}`}
                    value={String(idx)}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>
        {selectedFloor !== null && rooms[selectedFloor] && (
          <View className="flex flex-row flex-wrap gap-3">
            {rooms[selectedFloor].map((room, idx) => {
              const isSelected =
                selectedRoom?.roomNumber === room.roomNumber &&
                selectedRoom?.floor === selectedFloor;
              return (
                <TouchableOpacity
                  key={room.roomNumber}
                  className={`w-[30%] rounded-lg p-3 mb-3 items-center ${
                    isSelected ? "bg-blue-400" : "bg-gray-100"
                  }`}
                  onPress={() => handleRoomSelect(room.roomNumber)}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`font-semibold text-base ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Room {room.roomNumber}
                  </Text>
                  <Text
                    className={`text-xs mt-1 ${
                      isSelected ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {room.rollNo ? `Roll No: ${room.rollNo}` : "Vacant"}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
      <Button
        className="mt-4"
        disabled={!selectedRoom}
        onPress={handleAllocation}
        variant="solid"
      >
        <ButtonText className="text-white text-base font-semibold">
          Allocate
        </ButtonText>
      </Button>
    </View>
  );
};

export default ApprovePage;
