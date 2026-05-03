import { View, ActivityIndicator, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { getAdmissionSessions } from "@/utils/executiveWarden/ewAdmissionSessionApi";
import { getRoomsByAcademicYear } from "@/utils/executiveWarden/ewRoomApi";
import SelectField from "@/components/form/SelectField";
import { Formik } from "formik";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import HelperText from "@/components/HelperText";

const RoomView = () => {
  const [sessionOptions, setSessionOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [roomDetails, setRoomDetails] = useState<any>({});

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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Formik
      initialValues={{ academicYear: "" }}
      onSubmit={async (values) => {
        try {
          const data = await getRoomsByAcademicYear(values.academicYear);
          const grouped: Record<string, Record<string, any[]>> = {};
          data.forEach((room: any) => {
            const block = room.hostelBlock || "Unknown Block";
            const floor = String(room.floor ?? "Unknown Floor");
            if (!grouped[block]) grouped[block] = {};
            if (!grouped[block][floor]) grouped[block][floor] = [];
            grouped[block][floor].push(room);
          });
          setRoomDetails(grouped);
        } catch (err) {
          console.log("Error fetching room details:", err);
        }
      }}
    >
      {({ handleSubmit }) => (
        <View className="flex-1 bg-white p-4">
          <Text className="text-xl font-bold mb-4">RoomView</Text>
          <HelperText>
            This feature is in development, soon you will be able to have
            filters and search options to view room data for a specific academic
            year.
          </HelperText>
          <SelectField
            label="Academic Year"
            value="academicYear"
            options={sessionOptions}
          />
          <Button
            size="md"
            variant="solid"
            action="primary"
            onPress={handleSubmit as any}
            className="mt-3 mb-4"
          >
            <ButtonText>View room data</ButtonText>
          </Button>
          <ScrollView className="flex-1">
            {Object.keys(roomDetails).length === 0 && (
              <Text className="text-center mt-8 text-gray-400">
                No room data to display.
              </Text>
            )}
            {Object.entries(roomDetails).map(
              ([block, floors], blockIdx, arr) => (
                <View key={block} className="mb-8">
                  <Center>
                    <Text className="font-bold text-lg mb-1">{block}</Text>
                  </Center>
                  {blockIdx !== arr.length - 1 && <Divider className="my-2" />}
                  {Object.entries(floors as Record<string, any[]>).map(
                    ([floor, rooms]) => (
                      <View key={floor} className="mb-5">
                        <Text className="text-base font-semibold mb-2 text-slate-700">
                          Floor {floor}
                        </Text>
                        <View className="flex-row flex-wrap -mx-2 justify-center">
                          {rooms.map((room, idx) => (
                            <View
                              key={room.roomNumber ?? idx}
                              className="w-[30%] bg-slate-100 rounded-xl py-3 px-2 mb-3 items-center mx-2 shadow-sm"
                            >
                              <Text className="font-bold text-base text-slate-900 mb-1">
                                Room {room.roomNumber}
                              </Text>
                              <Text className="text-xs text-slate-500 text-center">
                                {room.rollNo &&
                                Array.isArray(room.rollNo) &&
                                room.rollNo.length > 0
                                  ? room.rollNo.join(", ")
                                  : "Vacant"}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )
                  )}
                </View>
              )
            )}
          </ScrollView>
        </View>
      )}
    </Formik>
  );
};

export default RoomView;
