import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { Formik } from 'formik'
import { useState } from 'react'
import TextField from '@/components/form/TextField'
import DatePickerField from '@/components/form/DatePickerField'
import CheckBoxField from '@/components/form/CheckBoxField'
import { Button, ButtonText } from '@/components/ui/button'
import { validationSchema, initialValues } from '@/constants/validations/admissionSessionValidation'
import { createAdmissionSession } from '@/utils/executiveWarden/ewAdmissionSessionApi'
import useLoadingStore from '@/stores/loadingStore'
import ModalCallable from '@/components/modals/ModalCallable'

const semesterOptions = Array.from({ length: 8 }, (_, i) => ({
  label: `Semester ${i + 1}`,
  value: `${i + 1}`,
}))

interface AdmissionSessionFormProps {
  initialValues?: typeof initialValues
  onSubmit?: (values: any) => void
  editMode?: boolean
}

const AdmissionSessionForm = ({
  initialValues: customInitialValues,
  onSubmit,
  editMode = false,
}: AdmissionSessionFormProps) => {
  const setLoading = useLoadingStore((state) => state.setLoading)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleFormSubmit = async (values: any) => {
    const semesters = (values.semesters as string[])
      .map(s => parseInt(s, 10))
      .filter(n => !isNaN(n))
    const sessionData = {
      from: values.from,
      to: values.to,
      semesters,
      academic_year: values.academic_year,
    }
    
    try {
      setLoading(true)
      await createAdmissionSession(sessionData)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to create admission session:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Formik
        initialValues={customInitialValues || initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit || handleFormSubmit}
      >
        {({ handleSubmit, isSubmitting }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
              keyboardShouldPersistTaps="handled"
            >
              <View className="bg-white p-6 rounded-2xl shadow-sm gap-6 mx-2">
                <DatePickerField label="Admission open from" value="from" />
                <DatePickerField label="To Date" value="to" />
                <CheckBoxField
                  label="Open admission for semesters"
                  value="semesters"
                  options={semesterOptions}
                />
                <TextField
                  label="Academic Year"
                  placeholder="e.g. 2025-2026"
                  value="academic_year"
                />
                <Button onPress={() => handleSubmit()} className="mt-2">
                  <ButtonText>{editMode ? "Save Changes" : "Start Session"}</ButtonText>
                </Button>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </Formik>
      
      <ModalCallable
        show={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success!"
        message="Admission session has been created successfully."
      />
    </>
  )
}

export default AdmissionSessionForm