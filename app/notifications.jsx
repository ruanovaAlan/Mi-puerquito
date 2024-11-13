import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";
import { AddIcon } from '../components/Icons';

export default function notifications() {
  return (
    <SafeAreaProvider>
      <View className='flex-1 bg-[#18181B] pt-4 px-3'>

        <Pressable className='flex flex-row items-center justify-end gap-8 pt-4 mb-6'>
          <View className="flex flex-row items-center">
            <AddIcon className='scale-90' />
            <Text className="text-[#60606C] text-lg font-bold ml-3">Agregar</Text>
          </View>
        </Pressable>



      </View>
      <StatusBar style='light' />
    </SafeAreaProvider>
  )
}