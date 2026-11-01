import { useEffect, useState } from 'react'
import ApprovalCard from '@/components/ApprovalCard'
import { getStudentAdmissionStatus } from '@/utils/student/studentAdmissionApi'
import useUserStore from '@/stores/userStore'
import { getAdmissionBadgeStatus, getFeePaymentBadgeStatus } from '@/utils/getBadgeStatus'
import { Button, ButtonText } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react-native'
import RefreshableScrollView from '@/components/common/RefreshableScrollView'
import { downloadFeeReceipt } from '@/utils/student/studentFeeReceiptApi'
import { Text, View } from 'react-native'

const AdmissionHistory = () => {
  const details = useUserStore((state) => state.details)
  const rollNo = details?.rollNo

  const [history, setHistory] = useState<any[]>([])
  const [feepayment, setFeepayment] = useState<Record<number, any[]>>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchHistory = async () => {
    if (!rollNo) return
    try {
      setIsRefreshing(true)
      const res = await getStudentAdmissionStatus(rollNo)
      setHistory(res.data.map((item: any) => item.admission));
      // setFeepayment(res.data.map((item: any) => item.fee_payment));
      let feepayments = []
      feepayments = res.data.map((item : any) => item.fee_payment)

      const feeMap = feepayments.reduce((acc: any, payment: any) => {
        const admissionId = payment.admissionId;

        if (!acc[admissionId]) {
          acc[admissionId] = [];
        }

        acc[admissionId].push(payment);

        return acc;
      }, {});

      setFeepayment(feeMap)

      
    } catch (e) {
      setHistory([])
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [rollNo])

  const download = async (admission_id : string, feePayment_id ?: string) => {
      await downloadFeeReceipt(admission_id, feePayment_id)
  }

  return (
    <RefreshableScrollView
      contentContainerStyle={{ padding: 16 }}
      onRefresh={fetchHistory}
      refreshing={isRefreshing}
      className='w-full sm:w-[80%] md:w-[80%] self-center'
    >
      
      {!rollNo ? (
        <Text>Roll number not found.</Text>
      ) : history.length === 0 ? (
        <Text>No admission history found.</Text>
      ) : (
        <>
        {history.map((item) => (
          <View key={item.id}>
            <ApprovalCard
              key={item.id}
              title={`Admission ${item.academicYear}`}
              subTitle={`Block: ${item.hostelBlock}, Mess: ${item.messPreference}`}
              badge={getAdmissionBadgeStatus(item.status)}
              data={item}
              downloadButton='Fee Receipt'
              onDownload={() => download(item.id)}
            />

            {feepayment[item.id].map((fee) => (
              <ApprovalCard
                key={fee.id}
                title={`Fee Payment ${fee.academicYear}`}
                subTitle={`Block: ${fee.hostelBlock}, Mess: ${fee.messPreference}`}
                badge={getFeePaymentBadgeStatus(fee.status)}
                data={fee}
                downloadButton='Fee Receipt'
                onDownload={() => download(fee.id, fee.admissionId)}
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