import { View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Link, useRouter } from 'expo-router'
import ScreenLayout from '../components/ScreenLayout'
import BlobLogin from '../components/BlobLogin'
import Logo from '../components/Logo'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as SQLite from 'expo-sqlite/next';


export default function index() {
  const router = useRouter()
  const [userName, setUserName] = useState('')


  const handleCreateUser = () => {

    router.replace('/(auth)/home')
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaProvider className='bg-[#18181B]'>
        <BlobLogin className='bg-[#18181B]' />
        <View className="items-center absolute top-16 w-full">
          <Logo />
        </View>

        <View className="items-center absolute top-20 w-full">
          <Text className='text-center text-[#F0FDF5] font-extrabold text-4xl absolute top-96 '>Mi Puerquito</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>


            <TextInput
              style={{
                width: '70%',
                height: 40,
                borderColor: '#ccc',
                borderBottomWidth: 1,
                marginTop: 20,
                color: 'white',
                paddingLeft: 10,
              }}
              placeholder="Ingresa tu usuario"
              placeholderTextColor="gray"
              value={userName}
              onChangeText={setUserName}
            />

            <Pressable
              style={{
                backgroundColor: '#1EC968',
                width: '70%',
                padding: 15,
                borderRadius: 8,
                marginTop: 20,
              }}
              onPress={handleCreateUser}
            >
              <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Crear Usuario</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>



      </SafeAreaProvider>
    </TouchableWithoutFeedback>
  )
}