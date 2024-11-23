import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { ArrowLeftIcon } from '../components/Icons'
import { useNavigation } from '@react-navigation/native';
import { AuthProvider } from '../context/AuthContext';
import { AppProvider } from '../context/AppContext';

export default function _layout() {
  const navigation = useNavigation();

  return (
    <AuthProvider>
      <AppProvider>
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='notifications'
            options={
              {
                headerTitle: 'Recordatorios',
                headerTintColor: '#F0FDF5',

                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon color={'#F0FDF5'} />
                  </TouchableOpacity>
                ),
                headerStyle: {
                  backgroundColor: '#18181B',
                },
              }
            }
          />
          <Stack.Screen name='(auth)' options={{
            headerShown: false
          }} />
        </Stack>
      </AppProvider>
    </AuthProvider>
  )
}