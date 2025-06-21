import { getVacatingHistroy } from '@/utils/vacatingHostelUtils';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import ApprovalCard, { badgeStatus } from '@/components/ApprovalCard';

const HostelVacationHistroy = () => {
    const [histroy, setHistroy] = useState<any[]>([]);
    const [formattedData, setFormattedData] = useState<[]>([]);
    useEffect(() => {
    const fetchHistroy = async () => {
        const data = await getVacatingHistroy();

        if (data) {
            setHistroy(data);

            const transformed = data.map((d: any) => ({
                RollNumber: d.vacating.roll_number,
                VacatingDate: d.vacating.vacating_date,
                VacatingTime: d.vacating.vacating_time,
                FutureAddress: d.vacating.future_address,
                ReturnedItems: d.vacating.returned_items?.join(", ") || "None",
                AccountHolder: d.caution.accountHolderName || "N/A",
                BankName: d.caution.bankName || "N/A",
                BankAddress : d.caution.addressOfTheBank,
                IFSC: d.caution.IFSCode || "N/A",
                RefundAmount: d.caution.refund_amount || "0.00",
                Deductions: d.caution.deductions || "0.00",
                SubmittedAt: new Date(d.vacating.created_at).toLocaleString(),
            }));

            setFormattedData(transformed);
        }
    };

    fetchHistroy();
}, []);


    return (
        <ScrollView>
            <View className='flex-1 bg-white p-2'>
                {histroy.length === 0 ? 
                    <View>
                        <Text>No Previous Histroy</Text>
                    </View>
                : 
                    histroy.map((d, index) => (
                        <ApprovalCard
                            title='Hostel Vacation'
                            subTitle={`Vacating Hostel at ${d.vacating.vacating_date}`}
                            badge={d.vacating.status == -1 ? 
                                    badgeStatus.Rejected : 
                                    d.vacating.status == 0 ? 
                                    badgeStatus.Approved : 
                                    badgeStatus.Pending}
                            data={formattedData[index]}
                        />     
                    ))
                }
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({})

export default HostelVacationHistroy;
