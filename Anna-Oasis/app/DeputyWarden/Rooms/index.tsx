import { View, Text } from 'react-native'
import  { useEffect } from 'react'
import { getRoomsByAcademicYear } from '../../../utils/deputyWarden/dwRoomApi'

const RoomView = () => {
  useEffect(() => {
    getRoomsByAcademicYear('2025-2026')
      .then(data => {
        console.log('Rooms data:', data)
      })
      .catch(err => {
        console.log('Error fetching rooms:', err)
      })
  }, [])

  return (
    <View>
      <Text>RoomView</Text>
    </View>
  )
}

export default RoomView