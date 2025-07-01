import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Box } from "@/components/ui/box";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { Pencil } from "lucide-react-native";
import { useRouter } from "expo-router";
import useUserStore from "@/stores/userStore";
import { fetchdata } from "@/utils/rc/rcDetails";

const RCDetailsViewPage = () => {
  const imageFields = ["passportPhotoUrl", "rcSignatureUrl"];

  const router = useRouter();
  const rcDetailsStore = useUserStore((state) => state.setDetails);
  const rcDetails = useUserStore((state) => state.details);
  const [fetch, setFetch] = useState<boolean>(false);

  function formatKey(key: string) {
    return key
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const fetchDetails = async () => {
    setFetch(true);
    try {
      const details = await fetchdata();
      rcDetailsStore(details);
      setFetch(false);
    } catch (error) {
      console.error("Error fetching RC details:", error);
      setFetch(false);
    }
  };

  useEffect(() => {
    if (!rcDetails || Object.keys(rcDetails).length === 0) {
      fetchDetails();
    }
  }, []);

  return (
    <Box>
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        <View className="bg-white rounded-xl shadow-sm mb-4 p-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {rcDetails && (
                  <>
                    <TableHead className="py-2 font-bold text-base">
                      Field
                    </TableHead>
                    <TableHead className="py-2 font-bold text-base">
                      Value
                    </TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rcDetails ? (
                Object.entries(rcDetails).map(
                  ([key, value], idx) =>
                    key !== "userId" && (
                      <TableRow key={idx}>
                        <TableData className="py-2">
                          <Text className="font-bold text-gray-800">
                            {formatKey(key)}
                          </Text>
                        </TableData>
                        <TableData className="py-2">
                          {imageFields.includes(key) &&
                          typeof value === "string" &&
                          value ? (
                            <Image
                              source={{ uri: value }}
                              className="w-20 h-20 rounded-lg my-1"
                              resizeMode="contain"
                            />
                          ) : (
                            <Text
                              className={
                                value === null ||
                                value === undefined ||
                                value === ""
                                  ? "text-gray-400"
                                  : "text-gray-800"
                              }
                            >
                              {value === null ||
                              value === undefined ||
                              value === ""
                                ? "not assigned yet"
                                : String(value)}
                            </Text>
                          )}
                        </TableData>
                      </TableRow>
                    )
                )
              ) : (
                <View className="h-[200px] flex items-center justify-center ">
                  {fetch ? (
                    <Text>Fetching...</Text>
                  ) : (
                    <Text>No Details found, Please Fill</Text>
                  )}
                </View>
              )}
            </TableBody>
          </Table>
        </View>
      </ScrollView>
      <Fab
        size="md"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => router.push("/RC/Details/Edit")}
      >
        <FabIcon as={Pencil} />
        <FabLabel>{rcDetails ? "Edit Details" : "Fill Details"}</FabLabel>
      </Fab>
    </Box>
  );
};

export default RCDetailsViewPage;
