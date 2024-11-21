import { View, Text } from 'react-native'
import React from 'react'

export default function HomeReminder({ reminder }) {
  return (

    <View
      style={{
        backgroundColor: '#3C3C43',
        borderRadius: 8,
      }}
      className='py-1 px-2 mb-2'
    >
      <Text style={{ color: '#FFFFFF' }} className='text-base font-bold'>
        {reminder.description}
      </Text>

      <View className='flex flex-row justify-between'>
        <Text style={{ color: '#AAAAAA' }} className='text-sm font-medium opacity-75'>${reminder.amount.toFixed(2)}</Text>
        <Text className="text-sm font-medium opacity-75">
          <Text style={{ color: new Date(reminder.reminder_date) < new Date() ? '#FF6B6B' : '#AAAAAA' }}>{reminder.reminder_date}</Text>
        </Text>
      </View>
    </View >

  )
}