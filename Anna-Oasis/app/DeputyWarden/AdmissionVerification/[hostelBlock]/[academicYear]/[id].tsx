import { useLocalSearchParams, router } from 'expo-router';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import useRoomStore from '@/stores/roomStore';
import { getRoomsByAcademicYear } from '@/utils/deputyWarden/dwRoomApi';
import { dwAllocateRoom, handleUpdateAdmission } from '@/utils/deputyWarden/dwAdmissionApi';
import useLoadingStore from '@/stores/loadingStore';
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
import { Text as UIText } from "@/components/ui/text";

interface Room {
  roomNumber: number;
  rollNo?: string | null;
  floor: number;
  hostelBlock: string;
  academicYear: string;
}

export default function RoomAllocation() {
  const { academicYear, id, hostelBlock } = useLocalSearchParams();
  const setRooms = useRoomStore((state) => state.setRooms);
  const rooms = useRoomStore((state) => state.rooms);
  const [floors, setFloors] = useState<number[]>([]);
  const [roomsByFloor, setRoomsByFloor] = useState<{ [floor: number]: Room[] }>({});
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<{
    roomNumber: number;
    floor: number;
  } | null>(null);
  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    if (academicYear) {
      getRoomsByAcademicYear(String(academicYear))
        .then((roomList: Room[]) => {
          // Filter rooms by hostelBlock
          const filteredRooms = roomList.filter(
            (room) => room.hostelBlock === hostelBlock
          );
          setRooms(filteredRooms);
          // Map rooms by floor
          const floorMap: { [floor: number]: Room[] } = {};
          filteredRooms.forEach((room) => {
            if (!floorMap[room.floor]) floorMap[room.floor] = [];
            floorMap[room.floor].push(room);
          });
          setRoomsByFloor(floorMap);
          const floorNumbers = Object.keys(floorMap).map(Number).sort((a, b) => a - b);
          setFloors(floorNumbers);
          setSelectedFloor(floorNumbers.length > 0 ? floorNumbers[0] : null);
        })
        .catch(() => {
          setRooms([]);
          setRoomsByFloor({});
          setFloors([]);
          setSelectedFloor(null);
        });
    }
  }, [academicYear, hostelBlock, setRooms]);

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
      await dwAllocateRoom(id as string, {
        room: selectedRoom.roomNumber,
        floor: selectedRoom.floor,
        hostel_block: String(hostelBlock),
      });
      await handleUpdateAdmission(id as string, {
        approve: true,
        comment: "Approved",
      });
      Alert.alert("Success", "Room Allocated successfully");
      router.replace("/ExecutiveWarden/AdmissionVerification");
    } catch (error: any) {
      Alert.alert(
        "Update Error",
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while allocating the room"
      );
      console.log(
        "Error allocating room:",
        error?.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <ScrollView className="flex-1">
        <UIText className="text-xl font-bold mb-4">
          Room Allocation - {id}
        </UIText>
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
                {floors.map((floor) => (
                  <SelectItem
                    key={floor}
                    label={`Floor ${floor}`}
                    value={String(floor)}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>
        {selectedFloor !== null && roomsByFloor[selectedFloor] && (
          <View className="flex flex-row flex-wrap gap-3">
            {roomsByFloor[selectedFloor].map((room: Room) => {
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
                  <UIText
                    className={`font-semibold text-base ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Room {room.roomNumber}
                  </UIText>
                  <UIText
                    className={`text-xs mt-1 ${
                      isSelected ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {room.rollNo ? `Roll No: ${room.rollNo}` : "Vacant"}
                  </UIText>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});