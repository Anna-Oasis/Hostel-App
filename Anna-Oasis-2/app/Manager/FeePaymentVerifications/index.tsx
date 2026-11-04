import { View, ScrollView, TextInput } from "react-native";
import { useEffect, useState } from "react";
import ApprovalCard from "@/components/ApprovalCard";
import {  getFeePaymentBadgeStatus } from "@/utils/getBadgeStatus";
import useLoadingStore from "@/stores/loadingStore";
import EmptyPage from "@/components/EmptyPage";
import DeclineComment from "@/components/modals/DeclineComment";
import { getAllManagerFeePayments, managerApprove, managerDecline } from "@/utils/manager/managerFeePaymentApi";

export default function FeePaymentVerificationsPage() {
  const [feePayments, setFeePayments] = useState<any[]>([]);

  const setLoading = useLoadingStore((state) => state.setLoading);

  const fetchFeePayments = async () => {
    try {
      const data = await getAllManagerFeePayments();
      setFeePayments(Array.isArray(data) ? data : []);
      console.log(data)
    } catch (err) {
      // console.log("Error fetching manager admissions:", err);
    }
  };

  useEffect(() => {
    fetchFeePayments();
  }, []);

  const handleApprove = async (admissionId: string) => {
    setLoading(true);
    await managerApprove(admissionId);
    fetchFeePayments();
    setLoading(false);
  };

  const handleDecline = async (admissionId: string) => {
    setLoading(true);
    await managerDecline(admissionId);
    setLoading(false);
    fetchFeePayments();
  };

  const [searchRollNo, setSearchRollNo] = useState("");

  const filteredPayments = feePayments.filter((feePayment) =>
      feePayment.fee_payment.roll_number
        ?.toString()
        .toLowerCase()
        .includes(searchRollNo.toLowerCase())
    );


  return (
    <View className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {feePayments.length === 0 ? (
          <EmptyPage
            title="No pending verifications"
            description="All payments have been reviewed."
          />
        ) : (
          <>
            <TextInput
              placeholder="Search by Roll No"
              value={searchRollNo}
              onChangeText={setSearchRollNo}
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white w-full sm:w-[80%] md:w-[50%] self-center"
            />
            {filteredPayments.map((item) => (
              <ApprovalCard
                key={item.fee_payment.id}
                title={`${item.fee_payment.roll_number}`}
                subTitle={`Block: ${item.fee_payment.hostelBlock}, Year: ${item.fee_payment.academicYear}`}
                badge={getFeePaymentBadgeStatus(item.fee_payment.status)}
                data={{ ...item.fee_payment, ...item.student }}
                onApprove={() => handleApprove(item.fee_payment.id)}
                onDecline={() => handleDecline(item.fee_payment.id)}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
