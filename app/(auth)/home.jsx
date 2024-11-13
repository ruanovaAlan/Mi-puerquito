import { View, Text } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useFetchCards } from '../../hooks/useFetchCards'
import ScreenLayout from '../../components/ScreenLayout'
import CreditCard from '../../components/wallet/CreditCard'

export default function home() {
  const { userId } = useContext(AuthContext);
  const { cards } = useFetchCards(userId);
  const lastCardAdded = cards[cards.length - 1];

  return (
    <ScreenLayout>
      <View className='flex flex-col pt-4 mb-6'>
        <Text className='text-white text-xl font-bold mb-6'>Última tarjeta registrada</Text>
        {cards.length > 0 ? (
          <CreditCard card={lastCardAdded} color='#74B3CE' />
        ) : (
          <Text className='text-white text-lg'>No hay tarjetas registradas</Text>
        )}
      </View>
    </ScreenLayout>
  )
}