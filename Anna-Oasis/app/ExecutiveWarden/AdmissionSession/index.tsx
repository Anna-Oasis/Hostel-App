import { View } from 'react-native'
import { useState } from 'react'
import TabSwitch from '@/components/TabSwitch'
import AdmissionSessionForm from '@/components/executiveWarden/AdmissionSessionForm'
import AdmissionSessionHistory from '@/components/executiveWarden/AdmissionSessionHistory'
import { FilePlus2, History } from 'lucide-react-native'

const AdmissionSession = () => {
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form')

  return (
    <View className="flex-1 bg-white">
      <TabSwitch
        tabs={[
          { label: 'Start Session', value: 'form' },
          { label: 'History', value: 'history' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        icons={{
          form: FilePlus2,
          history: History,
        }}
        className="mt-2"
      />
      <View className="flex-1 mt-4">
        {activeTab === 'form' ? (
          <AdmissionSessionForm />
        ) : (
          <AdmissionSessionHistory />
        )}
      </View>
    </View>
  )
}

export default AdmissionSession