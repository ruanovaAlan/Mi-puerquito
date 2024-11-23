import { View, Text } from 'react-native'
import React from 'react'
import { UpIcon, DownIcon } from '../Icons'

export default function ArrowsAmount({ income, expense }) {
  return (
    <View className='flex flex-row justify-around mb-8'>
      <View className='flex flex-row items-center gap-3'>
        <UpIcon color='#13773e' className='scale-105' />
        <View>
          <Text className='text-[#1EC968] text-xl font-bold'>${income}</Text>
          <Text className='text-[#ffffff7f] font-medium'>Ingresos</Text>
        </View>
      </View>

      <View className='flex flex-row items-center gap-3'>
        <DownIcon color='#a01313' className='scale-105' />
        <View className='flex flex-col '>
          <Text className='text-[#F00] text-xl font-bold'>${expense}</Text>
          <Text className='text-[#ffffff7f] font-medium'>Egresos</Text>
        </View>
      </View>
    </View>
  )
}