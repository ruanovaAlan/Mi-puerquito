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

  const usagePercentage = {
    available: (creditHealth.available * 100) / creditHealth.limit,
    used: Math.abs(100 - (creditHealth.available * 100) / creditHealth.limit)
  }

  const usageText = () => {
    if (usagePercentage.available >= 80) {
      return 'Consumo de crédito bajo'
    } else if (usagePercentage.available > 50 && usagePercentage.available < 80) {
      return 'Consumo de crédito medio'
    } else if (usagePercentage.available > 25 && usagePercentage.available <= 50) {
      return 'Consumo de crédito alto'
    } else {
      return 'Consumo de crédito muy alto'
    }
  }

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
            <Text className='text-[#ffffff99] text-lg font-semibold text-left'>${formatNumber(creditHealth.limit - creditHealth.available)}/${formatNumber(creditHealth.limit)}</Text >
            <View className='mx-auto mt-8 scale-110'>
              <EmojiHealthIndicator currentAmount={creditHealth.available} limitAmount={creditHealth.limit} />
            </View>
            <Text className='text-white text-center text-lg opacity-70 mt-6'>{usageText()}</Text>
            <View className='w-[80%] flex flex-row mx-auto mt-6'>
              <Text className='bg-red-500 rounded-l-xl'
                style={{
                  width: `${usagePercentage.used}%`,
                  borderRadius: usagePercentage.used === 100 ? 12 : 0
                }}
              />
              <Text className='bg-green-400 rounded-r-xl'
                style={{
                  width: `${usagePercentage.available}%`,
                  borderRadius: usagePercentage.available === 100 ? 12 : 0
                }}
              />
            </View>
          </View >
        )
      }
    </>
  )
}