import { getVacatingHistory } from '@/utils/vacatingHostelUtils';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import ApprovalCard, { badgeStatus } from '@/components/ApprovalCard';

const HostelVacationHistory = () => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getVacatingHistory();
      if (data) setHistory(data);
    };
    fetchHistory();
  }, []);

  return (
    <ScrollView>
      <View className='flex-1 bg-white p-2'>
        {history.length === 0 ? (
          <View>
            <Text>No Previous History</Text>
          </View>
        ) : (
          history.map((d, index) => {
            const vac = d.vacating;
            const caution = d.caution;
            return (
              <ApprovalCard
                key={vac.id}
                title='Hostel Vacation'
                subTitle={`Vacating Hostel at ${vac.vacating_date}`}
                badge={
                  vac.status == -1
                    ? badgeStatus.Rejected
                    : vac.status == 3
                    ? badgeStatus.Approved
                    : badgeStatus.Pending
                }
                data={{
                  "Roll Number": vac.roll_number,
                  "Vacating Date": vac.vacating_date,
                  "Vacating Time": vac.vacating_time,
                  "Future Address": vac.future_address,
                  "Returned Items": vac.returned_items?.join(", ") || "None",
                  "Account Holder": caution?.accountHolderName || "N/A",
                  "Bank Name": caution?.bankName || "N/A",
                  "Bank Address": caution?.addressOfTheBank || "N/A",
                  "IFSC": caution?.IFSCode || "N/A",
                  "Refund Amount": caution?.refund_amount || "0.00",
                  "Deductions": caution?.deductions || "0.00",
                  "Submitted At": new Date(vac.created_at).toLocaleString(),
                }}
              />
            );
          })
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default HostelVacationHistory;