import { View, Text } from 'react-native'
import React from 'react'

export default function CreditCard({ color, card }) {
  const accoundOptions = { credit: 'Crédito', debit: 'Débito', savings: 'Efectivo' }

  return (
    <View className='p-4 rounded-xl w-[200px] h-[130]' style={{ backgroundColor: color }}>
      <View className='flex flex-row justify-between mb-3'>
        <Text className='text-black text-lg font-semibold'>{accoundOptions[card.account_type]}</Text>
        <Text className='text-black text-lg font-semibold'>{card.last_four}</Text>
      </View>
      <Text className='text-black text-xl font-extrabold'>${card.balance}</Text>
      <View className='flex flex-row justify-between items-center mt-3'>
        <Text className='text-black text-md font-semibold'>{card.issuer}</Text>
        <Text className='text-black text-md font-semibold'>{
          card.account_type !== 'savings' ? card.expiration_date : ''
        }</Text>
      </View>
    </View>
  )
}