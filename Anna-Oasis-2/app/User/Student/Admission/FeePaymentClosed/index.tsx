import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Clock, AlertCircle, Calendar, Info } from 'lucide-react-native'

const FeePaymentClosed = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Clock size={80} color="#e74c3c" />
      </View>
      
      <Text style={styles.title}>Fee Payment Closed</Text>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  iconContainer: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#f39c12',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#5d6d7e',
    flex: 1,
    lineHeight: 20,
  },
})

export default FeePaymentClosed