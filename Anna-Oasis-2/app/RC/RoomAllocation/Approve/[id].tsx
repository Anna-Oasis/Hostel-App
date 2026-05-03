import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
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
import { allocateRoomAdmission, getAdmissionSessions, getAllRooms } from "@/utils/rc/rcAdmissionApi";
import useLoadingStore from "@/stores/loadingStore";

const ApprovePage = () => {
  const { id } = useLocalSearchParams();
  const rooms = useRCStore((state) => state.rooms)
  const setRooms = useRCStore((state) => state.setRooms);

  const hostelBlock = useRCStore((state) => state.hostelBlock);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(
     null
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

  const [sessionOptions, setSessionOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedSession, setSelectedSession] = useState<string>('')

  useEffect(() => {
    getAdmissionSessions()
      .then((data) => {
        const options = data.map((item: any) => ({
          label: item.academic_year,
          value: item.academic_year,
        }));
        setSessionOptions(options);
      })
      .catch((err) => {
        console.log("Error fetching admission sessions:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleRoomSelect = (roomNumber: number) => {
    if (selectedFloor !== null) {
      setSelectedRoom({ roomNumber, floor: selectedFloor });
    }
  };

  const handleSessionChange = (value : string) => {
    setSelectedSession(value)
  }

  const handleFetchRooms = async () => {
    try {
      const roomList = await getAllRooms(selectedSession);
      console.log(roomList)
      setRooms(roomList);
    } catch (error) {
      console.error('Error fetching rooms:', error);
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
        <Text className="text-xl font-bold mb-4">
          Approve Room Allocation - {id}
        </Text>
        <View className="mb-4 gap-4">
          
          <Select
            selectedValue={
              selectedFloor !== null ? "Select Academic Session" : undefined
            }
            onValueChange={handleSessionChange} 
          >
            <SelectTrigger variant="outline" size="md" className="w-full">
              <SelectInput placeholder="Select Academic Session" />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {sessionOptions.map((session, idx) => (
                  <SelectItem
                    key={idx}
                    label={session.label}
                    value={String(session.value)}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>

          <Button
            onPress={handleFetchRooms}
            size="xl"
          >
            <ButtonText className="text-white text-lg font-semibold">Fetch Rooms</ButtonText>
          </Button>

          {rooms.length > 0 && 
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
          }
        </View>
        {selectedFloor !== null && rooms.length > 0 && rooms[selectedFloor] && (
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
