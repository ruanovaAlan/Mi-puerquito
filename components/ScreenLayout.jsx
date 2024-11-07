import { View, Text, Pressable } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React from 'react'
import { Link } from 'expo-router';

import { SafeAreaProvider } from 'react-native-safe-area-context'
import PiggyIconSm from './PiggyIconSm'

export default function ScreenLayout({ children }) {
  return (
    <SafeAreaProvider>
      <View className='flex-1 bg-[#18181B] pt-4 px-2'>
        <Link asChild href="/(auth)/home" className='mt-6'>
          <Pressable className="flex-row items-center ">
            <PiggyIconSm />
            <Text className="text-[#F0FDF5] font-bold text-2xl">Mi Puerquito</Text>
          </Pressable>
        </Link>
        {children}
      </View>
      <StatusBar style='light' />
    </SafeAreaProvider>
  )
}