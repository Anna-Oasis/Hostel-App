import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  downloadApplicationForm,
  downloadReAdmissionForm,
  downloadRoomAllotmentForm,
} from "@/utils/manager/managerFormsApi";
import { getStudentAdmissionStatus } from "@/utils/manager/managerDetailApi";
import {
  getAdmissionBadgeStatus,
  getFeePaymentBadgeStatus,
} from "@/utils/getBadgeStatus";
import ApprovalCard from "@/components/ApprovalCard";
import { downloadFeeReceipt } from "@/utils/manager/managerFeeReceiptApi";

export default function FormsDownload() {
  const { id, rollNo } = useLocalSearchParams();

  const [history, setHistory] = useState<any[]>([]);
  // const [feepayment, setFeepayment] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await getStudentAdmissionStatus(rollNo);

      setHistory(res.data);

    } catch (error) {
      console.error(error);
      setHistory([]);
      // setFeepayment({});
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const downloadApplicationFormHelper = async (studentId: string) => {
    try {
      setLoading(true);
      await downloadApplicationForm(studentId);
    } catch (error) {
      console.error("Application form download failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadReadmissionFormHelper = async (studentId: string) => {
    try {
      setLoading(true);
      await downloadReAdmissionForm(studentId);
    } catch (error) {
      console.error("Readmission form download failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadRoomAllotmentFormHelper = async (studentId: string) => {
    try {
      setLoading(true);
      await downloadRoomAllotmentForm(studentId);
    } catch (error) {
      console.error("Room allotment form download failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const download = async (
    admission_id: string,
    roll_number: string,
    feePayment_id?: string
  ) => {
    try {
      setLoading(true);
      await downloadFeeReceipt(admission_id, roll_number, feePayment_id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#022B60" />
          <Text className="text-gray-600 mt-4 font-medium">
            Downloading receipt...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full">
            {/* Download Forms */}
            <Text className="text-xl font-bold text-gray-900 text-center mb-4">
              Download Forms
            </Text>

            <View className="items-center gap-3 mb-8">
              <Button
                className="bg-[#022B60] w-64"
                onPress={() => downloadApplicationFormHelper(id)}
              >
                <ButtonText>Application Form</ButtonText>
              </Button>

              <Button
                className="bg-[#022B60] w-64"
                onPress={() => downloadReadmissionFormHelper(id)}
              >
                <ButtonText>Readmission Form</ButtonText>
              </Button>

              <Button
                className="bg-[#022B60] w-64"
                onPress={() => downloadRoomAllotmentFormHelper(id)}
              >
                <ButtonText>Room Allotment</ButtonText>
              </Button>
            </View>

            {/* Admission History */}
            <Text className="text-xl font-bold text-gray-900 text-center mb-4">
              Admission History
            </Text>

            {fetching ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#022B60" />
                <Text className="text-gray-500 mt-3">
                  Fetching admission history...
                </Text>
              </View>
            ) : history.length === 0 ? (
              <View className="items-center py-8">
                <Text className="text-gray-500 text-center">
                  No admission history found.
                </Text>
              </View>
            ) : (
              history.map((item) => (
                  <View key={item.admission.id}>
                    <ApprovalCard
                      title={`Admission ${item.admission.academicYear}`}
                      subTitle={`Block: ${item.admission.hostelBlock}, Mess: ${item.admission.messPreference}`}
                      badge={getAdmissionBadgeStatus(item.admission.status)}
                      data={item.admission}
                      downloadButton="Fee Receipt"
                      onDownload={() => download(item.admission.id,item.roll_number)}
                    />

                    {item.fee_payment.map((fee: any) => (
                      <ApprovalCard
                        key={fee.id}
                        title={`Fee Payment ${fee.academicYear}`}
                        subTitle={`Block: ${fee.hostelBlock}, Mess: ${fee.messPreference}`}
                        badge={getFeePaymentBadgeStatus(fee.status)}
                        data={fee}
                        downloadButton="Fee Receipt"
                        onDownload={() => download(fee.admissionId, item.roll_number, fee.id)}
                      />
                    ))}
                  </View>
                ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
