import { View, Text } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../context/AppContext';
import { getTotalSavings, getTotalCreditInfo } from '../../utils/database'
import EmojiHealthIndicator from '../emojis/EmojiHealthIndicator';

export default function EmojiStats({ userId }) {
  const { walletReload, transReload } = useContext(AppContext);

  const [usedCredit, setUsedCredit] = useState({
    consumed: 0,
    limit: 0,
    forPayment: 0
  });

  useEffect(() => {
    const fetchCreditHealth = async () => {
      try {
        const { total_credit_limit, total_credit } = await getTotalCreditInfo(userId);
        const savings = await getTotalSavings(userId);

        setUsedCredit({
          consumed: total_credit,
          limit: total_credit_limit,
          forPayment: savings[0]?.total_balance || 0
        });

      } catch (error) {
        console.log("Error al obtener la salud crediticia:", error);
      }
    }
    fetchCreditHealth();
  }, [walletReload, transReload]);


  return (
    <View>
      <Text className='text-white text-xl font-bold mb-0'>Uso de crédito / Dinero disponible</Text>
      <View className='text-white flex flex-row'>
        <Text className='text-red-500 text-lg font-bold'>{usedCredit.limit - usedCredit.consumed}</Text>
        <Text className='text-white text-lg font-bold'>/{usedCredit.forPayment}</Text>
      </View>
      <View className='mx-auto scale-90'>
        <EmojiHealthIndicator
          currentAmount={usedCredit.limit - usedCredit.consumed}
          limitAmount={usedCredit.forPayment}
          isStats={true}
        />
      </View>
    </View>
  )
}