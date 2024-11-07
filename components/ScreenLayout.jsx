import { View } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React from 'react'
import { SafeAreaView } from 'react-native-web'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function ScreenLayout({ children }) {
  return (
    <SafeAreaProvider>
      <View className='flex-1 bg-[#18181B] pt-4 px-2'>
        {children}
      </View>
    </SafeAreaProvider>
  )
}