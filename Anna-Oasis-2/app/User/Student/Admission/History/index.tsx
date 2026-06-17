import { Text } from '@/components/ui/text'
import { useEffect, useState } from 'react'
import ApprovalCard from '@/components/ApprovalCard'
import { getStudentAdmissionStatus } from '@/utils/student/studentAdmissionApi'
import useUserStore from '@/stores/userStore'
import { getAdmissionBadgeStatus } from '@/utils/getBadgeStatus'
import { Button, ButtonText } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react-native'
import RefreshableScrollView from '@/components/common/RefreshableScrollView'
import { downloadFeeReceipt } from '@/utils/student/studentFeeReceiptApi'

const AdmissionHistory = () => {
  const details = useUserStore((state) => state.details)
  const rollNo = details?.rollNo

  const [history, setHistory] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchHistory = async () => {
    if (!rollNo) return
    try {
      setIsRefreshing(true)
      const res = await getStudentAdmissionStatus(rollNo)
      setHistory(res.data || [])
    } catch (e) {
      setHistory([])
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [rollNo])

  const download = async (item : any) => {
      const {
        name,
        rollNo,
        course,
        semester,
        branch
      } = details;

      const year = Math.ceil(Number(semester) / 2);

      const txId = item.transaction_id
      const paymentDate = item.submission_Date
      const amount = item.previousResident ? "1,18,000" : "1,40,000"

      await downloadFeeReceipt({
        "name": name,
        "rollNo": rollNo,
        "course": course,
        "year": String(year),
        "branch": branch,
        "semester": semester,
        "dateOfPayment": new Date(paymentDate).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        }),
        "amount": amount,
        "refId" : txId
      })

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
        history.map((item) => (
          <ApprovalCard
            key={item.id}
            title={`Admission ${item.academicYear}`}
            subTitle={`Block: ${item.hostelBlock}, Mess: ${item.messPreference}`}
            badge={getAdmissionBadgeStatus(item.status)}
            data={item}
            downloadButton='Fee Receipt'
            onDownload={() => download(item)}
          />
        ))
      )}
    </RefreshableScrollView>
  )
}

export default AdmissionHistory