import { useEffect, useState } from 'react'
import { ScrollView, Alert } from 'react-native'
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { Modal, ModalBackdrop, ModalContent, ModalCloseButton, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"
import { Icon } from "@/components/ui/icon"
import { Pencil, X as CloseIcon } from "lucide-react-native"
import AdmissionSessionForm from './AdmissionSessionForm'
import EmptyPage from "@/components/EmptyPage"
import { getAdmissionSessions, editAdmissionSession } from "@/utils/executiveWarden/ewAdmissionSessionApi"
import ModalCallable from "@/components/modals/ModalCallable"

const AdmissionSessionHistory = () => {
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editSession, setEditSession] = useState<any | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    getAdmissionSessions().then(data => {
      if (data) setSessions(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleEdit = async (values: any) => {
    if (!editSession) return;
    try {
      const updatedSession = await editAdmissionSession(editSession.id, {
        from: values.from,
        to: values.to,
        semesters: values.semesters.map((s: string) => Number(s)),
        academic_year: values.academic_year,
      });
      setSessions(prev =>
        prev.map(session =>
          session.id === editSession.id ? updatedSession : session
        )
      );
      setShowSuccessModal(true);
    } catch (e) {
      Alert.alert("Edit Error", "An error occurred while editing the admission session. Please try again.");
    }
    setShowModal(false);
    setEditSession(null);
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
        {sessions.length === 0 ? (
          <EmptyPage
            title="No admission sessions found."
            description="There are currently no admission sessions to display."
          />
        ) : (
          sessions.map(session => (
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
                className="self-end mt-2 px-4 rounded-lg flex-row items-center"
                onPress={() => {
                  setEditSession(session)
                  setShowModal(true)
                }}
              >
                <ButtonIcon as={Pencil} size="sm" className="mr-2" />
                <ButtonText className="font-semibold">Edit</ButtonText>
              </Button>
            </Box>
          ))
        )}
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
      <ModalCallable
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        message="Admission session updated successfully."
      />
    </Box>
  )
}

export default AdmissionSessionHistory