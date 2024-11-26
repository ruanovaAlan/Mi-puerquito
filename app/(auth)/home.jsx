import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Animated, Easing } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import { useFetchCards } from '../../hooks/useFetchCards';
import { useFetchTransactions } from '../../hooks/useFetchTransactions';

import ScreenLayout from '../../components/ScreenLayout';
import CreditCard from '../../components/wallet/CreditCard';
import { getRemindersByUser, getLast3TransactionsByUserId } from '../../utils/database';
import HomeReminder from '../../components/reminders/HomeReminder';
import HomeTransaction from '../../components/transactions/HomeTransaction';

export default function Home() {
  const { userId, userName } = useContext(AuthContext);
  const { count } = useContext(AppContext);
  const { cards } = useFetchCards(userId);
  const [transactions, setTransactions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isGreetingVisible, setIsGreetingVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const result = await getLast3TransactionsByUserId(userId);
        setTransactions(result);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    const fetchReminders = async () => {
      try {
        const result = await getRemindersByUser(userId);
        const sortedReminders = result.sort((a, b) => new Date(a.reminder_date) - new Date(b.reminder_date));
        setReminders(sortedReminders);
      } catch (error) {
        console.error("Error fetching reminders:", error);
      }
    };

    fetchTransactions();
    fetchReminders();

    const greetingTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => setIsGreetingVisible(false));
    }, 10000);

    return () => {
      clearTimeout(greetingTimer);
    };

  }, [userId, count, opacity, translateY]);

  const lastCardAdded = cards[cards.length - 1];

  return (
    <ScreenLayout>

      {isGreetingVisible && (
        <Animated.View style={{ opacity, transform: [{ translateY }] }} className='my-2'>
          <Text className="text-[#FFD046] text-3xl font-bold text-center">¡Hola, {userName}!</Text>
        </Animated.View>
      )}

      <ScrollView>
        <View className="flex flex-col pt-4 mb-0">
          <Text className="text-white text-xl font-bold mb-3">Última tarjeta registrada</Text>
          {cards.length > 0 ? (
            <CreditCard card={lastCardAdded} color="#74B3CE" />
          ) : (
            <Text className="text-white text-lg text-center opacity-50 my-6">No hay tarjetas registradas</Text>
          )}
        </View>

        <View className="flex flex-col pt-4 mb-0">
          <Text className="text-white text-xl font-bold mb-3">Últimos movimientos</Text>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <HomeTransaction key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <Text className="text-white text-lg text-center opacity-50 my-6">No hay movimientos registrados</Text>
          )}
        </View>

        <View className="flex flex-col pt-2 mb-0">
          <Text className="text-white text-xl font-bold mb-3">Próximos recordatorios</Text>
          {reminders.length > 0 ? (
            reminders.slice(0, 3).map((reminder) => (
              <HomeReminder key={reminder.id} reminder={reminder} />
            ))
          ) : (
            <Text className="text-white text-lg text-center opacity-50 my-6">No hay recordatorios registrados</Text>
          )}
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
