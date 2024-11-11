import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import { AddIcon } from '../../components/Icons'
import CreditCard from '../../components/CreditCard'

export default function Wallet() {
  return (
    <ScreenLayout>

      <View className='flex flex-row items-center gap-8 pt-4'>
        <Text className='text-white text-xl font-bold '>Tarjetas</Text>
        <View className="flex flex-row items-center">
          <AddIcon className='scale-90' />
          <Text className="text-[#60606C] text-lg font-bold ml-3">Agregar</Text>
        </View>
      </View>

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} className="mt-6">
        <View className="flex flex-row" style={{ gap: 20 }}>
          <CreditCard />
          <CreditCard />
          <CreditCard />
          <CreditCard />
        </View>
      </ScrollView>

    </ScreenLayout >
  )
}