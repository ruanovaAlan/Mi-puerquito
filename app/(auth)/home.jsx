import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import useFetchClosestReminder from '../../hooks/useFetchClosestReminder';
import {useFetchCards} from '../../hooks/useFetchCards';
import ScreenLayout from '../../components/ScreenLayout';
import CreditCard from '../../components/wallet/CreditCard';
import { FontAwesome } from '@expo/vector-icons';

export default function Home() {
  const { userId } = useContext(AuthContext);
  const { cards } = useFetchCards(userId);
  const lastCardAdded = cards[cards.length - 1];
  const closestReminder = useFetchClosestReminder(userId);

  return (
    <ScreenLayout>
      <View className="flex flex-col pt-4 mb-6">
        <Text className="text-white text-xl font-bold mb-6">Última tarjeta registrada</Text>
        {cards.length > 0 ? (
          <CreditCard card={lastCardAdded} color="#74B3CE" />
        ) : (
          <Text className="text-white text-lg">No hay tarjetas registradas</Text>
        )}
      </View>

      <View className="flex flex-col pt-4 mb-6">
        <Text className="text-white text-xl font-bold mb-6">Recordatorio más cercano</Text>
        {closestReminder ? (
        <View
          style={{
            backgroundColor: '#3C3C43',
            padding: 16,
            borderRadius: 8,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
            {closestReminder.description}
          </Text>
          <View style={{ borderBottomColor: '#565661', borderBottomWidth: 1, marginBottom: 8 }} />
          <Text style={{ color: '#AAAAAA', fontSize: 14 }}>Monto: ${closestReminder.amount.toFixed(2)}</Text>
          <Text className="text-sm">
            <Text style={{ color: '#AAAAAA' }}>Fecha: </Text>
            <Text style={{ color: new Date(closestReminder.reminder_date) < new Date() ? '#FF6B6B' : '#AAAAAA' }}>{closestReminder.reminder_date}</Text>
          </Text>
        </View>
      
        
        ) : (
          <Text className="text-white text-lg">No hay recordatorios próximos</Text>
        )}
      </View>
    </ScreenLayout>
  );
}
