import { View, Text } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { getTotalCreditInfo } from '../../utils/database'
import { formatNumber } from '../../utils/helpers'
import EmojiHealthIndicator from '../emojis/EmojiHealthIndicator'
import { AppContext } from '../../context/AppContext';


export default function CreditHealth({ user_id }) {
  const { walletReload } = useContext(AppContext);

  const [creditHealth, setCreditHealth] = useState({
    available: 0,
    limit: 0
  });

  useEffect(() => {
    const fetchCreditHealth = async () => {
      try {
        const { total_credit_limit, total_credit } = await getTotalCreditInfo(user_id);
        setCreditHealth({
          available: total_credit,
          limit: total_credit_limit
        });
      } catch (error) {
        console.log("Error al obtener la salud crediticia:", error);
      }
    }
    fetchCreditHealth();
  }, [walletReload]);

  return (
    <>
      <Text className="text-white text-xl font-bold">Uso de crédito</Text>
      {creditHealth.limit === 0 && creditHealth.available === 0 ? (
        <Text className='text-white text-lg text-center opacity-50 mt-6'>
          Aún no tienes crédito disponible
        </Text>
      ) :
        (
          <View className=''>
            <Text className='text-[#ffffff99] text-lg font-semibold text-left'>${formatNumber(creditHealth.available)}/${formatNumber(creditHealth.limit)}</Text >
            <View className='mx-auto mt-3'>
              <EmojiHealthIndicator currentAmount={creditHealth.available} limitAmount={creditHealth.limit} />
            </View>
          </View >
        )
      }
    </>
  )
}