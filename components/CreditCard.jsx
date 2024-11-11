import { View, Text } from 'react-native'
import React from 'react'

export default function CreditCard() {
  return (
    <View className='bg-[#74B3CE] p-4 rounded-xl w-[200px] h-[130]'>
      <View className='flex flex-row justify-between mb-3'>
        <Text className='text-black text-lg font-semibold'>Tipo</Text>
        <Text className='text-black text-lg font-semibold'>xxxx</Text>
      </View>
      <Text className='text-black text-xl font-extrabold'>$10000</Text>
      <Text style={{ textAlign: 'right' }} className='text-black text-lg font-semibold'>10/11/24</Text>
    </View>
  )
}