import { View, ScrollView, Alert } from "react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { router } from "expo-router";
import {
  UserIcon,
  HomeIcon,
  ClipboardIcon,
  CalendarIcon,
  FileTextIcon,
  BuildingIcon,
} from "lucide-react-native";
import DetailsCard from "@/components/student/DetailsCard";
import { useEffect, useState } from "react";
import {
  getStudentDetails,
  getStudentAdmissionDetails,
} from "@/utils/student/studentDetailsApi";
import useUserStore from "@/stores/userStore";
import HelperText from "@/components/HelperText";

export default function StudentMain() {
  const menuItems = [
    {
      title: "Personal Details",
      route: "/User/Student/Details",
      icon: UserIcon,
      color: "#6366F1",
    },
    {
      title: "Admission",
      route: "/User/Student/Admission",
      icon: HomeIcon,
      color: "#4F46E5",
    },
    {
      title: "Leave Form",
      route: "/User/Student/LeaveForm",
      icon: ClipboardIcon,
      color: "#0891B2",
    },
    {
      title: "Summer Vacation",
      route: "/User/Student/SummerVacation",
      icon: CalendarIcon,
      color: "#D97706",
    },
    {
      title: "Grievances",
      route: "/User/Student/Grievances",
      icon: FileTextIcon,
      color: "#EF4444",
    },
    {
      title: "Hostel Vacation",
      route: "/User/Student/HostelVacation",
      icon: BuildingIcon,
      color: "#10B981",
    },
  ];

  const setDetails = useUserStore((state) => state.setDetails);
  const details = useUserStore((state) => state.details);
  const [admissionStatus, setAdmissionStatus] = useState<number | null>(null);
  const [admissionCount, setAdmissionCount] = useState<number>(0);

  const fetchDetails = async () => {
    try {
      const details = await getStudentDetails();
      if (details.count === 0) {
        Alert.alert(
          "Personal Details",
          "Please fill your personal details first"
        );
        router.push("/User/Student/Details/Edit");
      } else {
        setDetails(details.data);
        // Call admission details API and log the data
        if (details.data?.rollNo) {
          const admissionData = await getStudentAdmissionDetails(
            details.data.rollNo
          );
          console.log("Student Admission Data:", admissionData);
          setAdmissionCount(admissionData.count);
          if (admissionData.count > 0 && admissionData.data?.[0]?.status) {
            setAdmissionStatus(Number(admissionData.data[0].status));
          } else {
            setAdmissionStatus(null);
          }
        } else {
          setAdmissionCount(0);
          setAdmissionStatus(null);
        }
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      setAdmissionCount(0);
      setAdmissionStatus(null);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <>
      <ScrollView>
        <View className="flex-row flex-wrap justify-between items-center p-8">
          <DetailsCard />
          {details?.approve === false && (
            <View className="w-full mb-2">
              <HelperText>
                Your profile is not verified yet. You cannot access other
                features until manager verifies your profile.
              </HelperText>
            </View>
          )}
          {(admissionCount === 0 ||
            (admissionStatus !== null && admissionStatus < 3) ||
            details?.roomNumber == null) && (
            <View className="w-full mb-2">
              <HelperText>
                Please wait until your admission is approved and room is
                allocated.
              </HelperText>
            </View>
          )}
          {menuItems.map((item, idx) => {
            // Disable logic:
            // If admissionCount == 0 or admissionStatus < 3 or details.roomNumber is null,
            // only allow "Personal Details" and "Admission"
            const isAdmissionOrPersonal =
              item.title === "Personal Details" || item.title === "Admission";
            const isDisabled =
              ((admissionCount === 0 ||
                (admissionStatus !== null && admissionStatus < 3) ||
                details?.roomNumber == null) &&
                !isAdmissionOrPersonal) ||
              (details?.approve === false && item.title !== "Personal Details");
            return (
              <Button
                key={idx}
                onPress={() => router.push(item.route as any)}
                className="w-[48%] h-40 mb-4 rounded-xl flex-col justify-center items-center"
                style={[
                  { backgroundColor: item.color },
                  isDisabled && { opacity: 0.5 },
                ]}
                variant="solid"
                disabled={isDisabled}
              >
                <ButtonIcon as={item.icon} size="xl" color="white" />
                <ButtonText className="mt-3 text-base font-medium">
                  {item.title}
                </ButtonText>
              </Button>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}
