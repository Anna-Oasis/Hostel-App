import { useEffect, useState } from 'react'
import ApprovalCard from '@/components/ApprovalCard'
import { getStudentAdmissionStatus } from '@/utils/student/studentAdmissionApi'
import useUserStore from '@/stores/userStore'
import { getAdmissionBadgeStatus, getFeePaymentBadgeStatus } from '@/utils/getBadgeStatus'
import { Button, ButtonText } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react-native'
import RefreshableScrollView from '@/components/common/RefreshableScrollView'
import { downloadFeeReceipt } from '@/utils/student/studentFeeReceiptApi'
import { ActivityIndicator, View, Text } from 'react-native'

const AdmissionHistory = () => {
  const details = useUserStore((state) => state.details)
  const rollNo = details?.rollNo

  const [history, setHistory] = useState<any[]>([])
  // const [feepayment, setFeepayment] = useState<Record<number, any[]>>({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loader, setLoader] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchHistory = async () => {
    if (!rollNo) return;

    try {
      setIsRefreshing(true);

      const res = await getStudentAdmissionStatus(rollNo);

      setHistory(res.data);

    } catch (e) {
      console.error("Error fetching admission history:", e);
      setHistory([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory()
    console.log("Admission History");
  }, [rollNo])

  const download = async (admission_id : string, feePayment_id ?: string) => {
      setLoading(true)
      await downloadFeeReceipt(admission_id, feePayment_id)
      setLoading(false)
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#022B60" />
        <Text className="mt-3 text-sm text-slate-500">
          Downloading...
        </Text>
      </View>
    );
  }
  return (
    <RefreshableScrollView
      contentContainerStyle={{ padding: 16, height : '100%' }}
      onRefresh={fetchHistory}
      refreshing={isRefreshing}
    >
      {loader && (
        <View className="absolute inset-0 z-50 items-center justify-center bg-black/20">
          <ActivityIndicator size="large" color="#022B60" />
        </View>
      )}
      {!rollNo ? (
        <Text>Roll number not found.</Text>
      ) : history.length === 0 ? (
        <Text>No admission history found.</Text>
      ) : (
        <>
         {history.map((item) => (
            <View key={item.admission.id}>
              <ApprovalCard
                title={`Admission ${item.admission.academicYear}`}
                subTitle={`Block: ${item.admission.hostelBlock}, Mess: ${item.admission.messPreference}`}
                badge={getAdmissionBadgeStatus(item.admission.status)}
                data={item.admission}
                downloadButton="Fee Receipt"
                onDownload={() => download(item.admission.id)}
              />

              {item.fee_payment.map((fee: any) => (
                <ApprovalCard
                  key={fee.id}
                  title={`Fee Payment ${fee.academicYear}`}
                  subTitle={`Block: ${fee.hostelBlock}, Mess: ${fee.messPreference}`}
                  badge={getFeePaymentBadgeStatus(fee.status)}
                  data={fee}
                  downloadButton="Fee Receipt"
                  onDownload={() => download(fee.admissionId, fee.id)}
                />
              ))}
            </View>
          ))}

        </>
      )}
    </RefreshableScrollView>
  )
}

export default AdmissionHistory