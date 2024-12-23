import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { HomeIcon, ChartIcon, AddIcon, CardIcon, PiggyIcon } from '../../components/Icons'
import PiggyIconSm from '../../components/PiggyIconSm'
import { AuthProvider } from '../../context/AuthContext'
import { CardsProvider } from '../../context/CardsContext'
import { TransactionsProvider } from '../../context/TransactionsContext'

export default function AuthLayout() {
  return (
    <AuthProvider>
      <CardsProvider>
        <TransactionsProvider>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: '#000',
                borderTopColor: '#000',
                paddingTop: 10,

              },
              tabBarInactiveTintColor: '#60606C',
              tabBarActiveTintColor: '#1EC968',
              tabBarShowLabel: false,
            }}
          >

            <Tabs.Screen name="home" options={{
              tabBarIcon: ({ color }) => <HomeIcon color={color} />,
              tabBarIconStyle: { width: 'auto', }
            }} />

            <Tabs.Screen name="stats" options={{
              tabBarIcon: ({ color }) => <ChartIcon color={color} />,
              tabBarIconStyle: { width: 'auto' }
            }} />

            <Tabs.Screen
              name="transactions"
              options={{
                tabBarIcon: ({ focused }) => (
                  <AddIcon color={focused ? '#ffd14680' : '#FFD046'} />
                ),
                tabBarIconStyle: { width: 'auto' }
              }}
            />

            <Tabs.Screen name="wallet" options={{
              tabBarIcon: ({ color },) => <CardIcon color={color} />,
              tabBarIconStyle: { width: 'auto', }
            }} />

            <Tabs.Screen name="savings" options={{
              tabBarIcon: ({ color }) => <PiggyIcon color={color} />,
              tabBarIconStyle: { width: 'auto' }
            }} />

          </Tabs>
        </TransactionsProvider>
      </CardsProvider>
    </AuthProvider >
  )
}