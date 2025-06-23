import { ScrollView } from 'react-native'
import { Text } from '@/components/ui/text'
import { useEffect, useState } from 'react'
import ApprovalCard from '@/components/ApprovalCard'
import { getStudentAdmissionStatus } from '@/utils/student/studentAdmissionApi'
import useUserStore from '@/stores/userStore'
import { getAdmissionBadgeStatus } from '@/utils/getBadgeStatus'

const AdmissionHistory = () => {
  const details = useUserStore((state) => state.details)
  const rollNo = details?.rollNo

  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (!rollNo) return
    const fetchHistory = async () => {
      try {
        const res = await getStudentAdmissionStatus(rollNo)
        setHistory(res.data || [])
      } catch (e) {
        setHistory([])
      }
    }
    fetchHistory()
  }, [rollNo])

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text className="text-2xl font-bold mb-4">Admission History</Text>
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
            data={{
              "Roll Number": item.roll_number,
              "Academic Year": item.academicYear,
              "Admission Category": item.admissionCategory,
              "Previous Resident": item.previousResident ? "Yes" : "No",
              "Student Agreed": item.studentAgreed ? "Yes" : "No",
              "Parent Agreed": item.parentAgreed ? "Yes" : "No",
              "Transaction ID": item.transaction_id,
              "Submission Date": item.submission_Date,
              "Status": getAdmissionBadgeStatus(item.status),
            }}
          />
        ))
      )}
    </ScrollView>
  )
}

export default AdmissionHistory