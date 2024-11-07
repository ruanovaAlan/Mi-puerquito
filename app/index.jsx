import { View, Text, Pressable, TextInput } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import ScreenLayout from '../components/ScreenLayout'
import BlobLogin from '../components/BlobLogin'
import Logo from '../components/Logo'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function index() {
  const router = useRouter()

  const handleCreateUser = () => {
    router.replace('/(auth)/home')
  }

  return (
    <SafeAreaProvider className='bg-[#18181B]'>
      <BlobLogin className='bg-[#18181B]' />
      <View className="items-center absolute top-16 w-full">
        <Logo />
      </View>

      <View className="items-center absolute top-20 w-full">
        <Text className='text-center text-white font-extrabold text-4xl absolute top-96 '>Mi Puerquito</Text>
      </View>

      <View className="flex-1 items-center mt-20 ">
        <Text className='text-white text-xl w-[70%] mb-2 font-extrabold'>Usuario</Text>
        <TextInput
          className="border-b border-gray-400 text-lg w-[70%] px-2 text-white"
          placeholder="Ingresa tu usuario"
          placeholderTextColor="gray"
        />

        <Pressable className='bg-[#1EC968] w-[70%] py-2 mt-16 mx-auto rounded-lg'
          onPress={handleCreateUser}
        >
          <Text className='text-black text-2xl text-center font-bold'>Crear usuario</Text>

        </Pressable>
      </View>




    </SafeAreaProvider>
  )
}