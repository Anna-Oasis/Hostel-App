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
import ModalCallable from '@/components/modals/ModalCallable'
import { ActivityIndicator, View } from 'react-native'

const AdmissionHistory = () => {
  const details = useUserStore((state) => state.details)
  const rollNo = details?.rollNo

  const [history, setHistory] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loader, setLoader] = useState(false)
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
      setLoader(true)
      await downloadFeeReceipt(item.id)
      setLoader(false)
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