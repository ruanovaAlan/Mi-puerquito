import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import ScreenLayout from '../../components/ScreenLayout';
import GenerateReport from '../../components/stats/GenerateReport';
import ChartStats from '../../components/stats/ChartStats';
import { getExpensesByUser } from '../../utils/database';
import EmojiStats from '../../components/stats/EmojiStats';


export default function Stats() {
  const { userId } = useContext(AuthContext);
  const { count } = useContext(AppContext);
  const [expenses, setExpenses] = useState([]);
  const date = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactions = await getExpensesByUser(userId);
        setExpenses(transactions);
      } catch (error) {
        console.error('Error al obtener transacciones:', error);
      }
    };
    fetchTransactions();
    console.log('Stats:', expenses);
  }, [count]);

  return (
    <ScreenLayout>
      <ScrollView>
        <View>

          <View className="flex flex-row items-center justify-between  pt-4 mb-10">
            <Text className="text-white text-xl font-bold">Estadísticas</Text>
            <GenerateReport userId={userId} date={date} />
          </View>

          {expenses.length === 0 ? (
            <Text className="text-white text-lg text-center opacity-50 mt-6">
              No hay movimientos para mostrar las estadísticas
            </Text>

          ) : (
            <View>
              <EmojiStats userId={userId} />
              <ChartStats userId={userId} />
            </View>
          )}

        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
