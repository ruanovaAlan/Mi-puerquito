import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";

export default function notifications() {
  return (
    <SafeAreaProvider>
      <View className='flex-1 bg-[#18181B] pt-4 px-2'>

      </View>
      <StatusBar style='light' />
    </SafeAreaProvider>
  )
}