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
import {
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab";
import { Pencil } from "lucide-react-native";
import { useRouter } from "expo-router";
import useUserStore from "@/stores/userStore";
import { fetchdata } from "@/utils/rc/rcDetails";
import RCDetailsCard from "@/components/rc/DetailsCard";
import { Divider } from "@/components/ui/divider";

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
      rcDetailsStore(details[0] || {});
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
        <RCDetailsCard />
        <Divider className="my-4" />
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
              {fetch ? (
                <TableRow>
                  <TableData className="py-8">
                    <View className="flex flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="#4F46E5" />
                      <Text className="ml-2 text-gray-700">
                        Fetching details...
                      </Text>
                    </View>
                  </TableData>
                </TableRow>
              ) : rcDetails && Object.keys(rcDetails).length > 0 ? (
                Object.entries(rcDetails)
                  .filter(
                    ([key]) =>
                      ![
                        "userId",
                        "name",
                        "passportPhotoUrl",
                        "registerNo",
                        "dept",
                      ].includes(key)
                  )
                  .map(([key, value], idx) => (
                    <TableRow
                      key={key}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#f9fafb" : "#fff",
                      }}
                    >
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
                  ))
              ) : (
                <TableRow>
                  <TableData className="py-8">
                    <View className="flex items-center justify-center">
                      <Text>No Details found, Please Fill</Text>
                    </View>
                  </TableData>
                </TableRow>
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
        <FabLabel>
          {rcDetails && Object.keys(rcDetails).length > 0
            ? "Edit Details"
            : "Fill Details"}
        </FabLabel>
      </Fab>
    </Box>
  );
};

export default RCDetailsViewPage;
                        