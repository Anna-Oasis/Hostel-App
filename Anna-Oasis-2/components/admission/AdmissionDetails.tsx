import { View } from 'react-native'
import SelectField from '@/components/form/SelectField'
import { messPreferences, previousResidentOptions } from '@/constants/admission'


const AdmissionDetails = () => {

  return (
    <View className="px-4 py-6">
      <View className="mb-6">
        <SelectField
          label="Mess Preference"
          value="messPreference"
          options={messPreferences}
        />
        <View className="mt-4" />
        <SelectField
          label="Are you a previous resident of the hostel?"
          value="previousResident"
          options={previousResidentOptions}
        />
      </View>
    </View>
  )
}

export default AdmissionDetails