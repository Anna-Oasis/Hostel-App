import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Button, ButtonText } from "@/components/ui/button"
import { Modal, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Icon, CloseIcon } from "@/components/ui/icon"
import AdmissionSessionForm from './AdmissionSessionForm'

const fetchAdmissionSessions = async () => {
  return {
    success: true,
    data: [
      {
        id: 1,
        from: "2024-07-01",
        to: "2024-12-31",
        semesters: [3, 5, 7],
        academic_year: "2025-2026"
      }
    ],
    count: 1,
    message: "Fetched admission sessions successfully"
  }
}

const AdmissionSessionHistory = () => {
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editSession, setEditSession] = useState<any | null>(null)

  useEffect(() => {
    fetchAdmissionSessions().then(res => {
      if (res.success) setSessions(res.data)
      setLoading(false)
    })
  }, [])

  const handleEdit = (values: any) => {
    console.log('Edit values:', values)
    setShowModal(false)
    setEditSession(null)
  }

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-0">
        <Text className="text-lg text-typography-1">Loading...</Text>
      </Box>
    )
  }

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {sessions.length === 0 && (
          <Text className="text-center text-typography-3 mt-8">
            No admission sessions found.
          </Text>
        )}
        {sessions.map(session => (
          <Box
            key={session.id}
            className="bg-white rounded-2xl p-5 mb-4 border border-gray-100"
          >
            <Text className="text-xl font-bold mb-2 text-typography-1">
              Academic Year: <Text className="font-normal">{session.academic_year}</Text>
            </Text>
            <Text className="mb-1 text-typography-1">
              From: <Text className="font-semibold">{session.from}</Text>
            </Text>
            <Text className="mb-1 text-typography-1">
              To: <Text className="font-semibold">{session.to}</Text>
            </Text>
            <Text className="mb-3 text-typography-1">
              Semesters: <Text className="font-semibold">{session.semesters.join(', ')}</Text>
            </Text>
            <Button
              size="md"
              variant="solid"
              action="primary"
              className="self-end mt-2 px-4 rounded-lg"
              onPress={() => {
                setEditSession(session)
                setShowModal(true)
              }}
            >
              <ButtonText className="font-semibold">Edit Details</ButtonText>
            </Button>
          </Box>
        ))}
      </ScrollView>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditSession(null)
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text className="text-xl font-bold text-typography-950">
              Edit Admission Session
            </Text>
            <ModalCloseButton>
              <Icon as={CloseIcon} size="md" className="stroke-background-400" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {editSession && (
              <AdmissionSessionForm
                initialValues={{
                  from: editSession.from,
                  to: editSession.to,
                  semesters: editSession.semesters.map((s: number) => String(s)),
                  academic_year: editSession.academic_year,
                }}
                onSubmit={handleEdit}
                editMode
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false)
                setEditSession(null)
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AdmissionSessionHistory