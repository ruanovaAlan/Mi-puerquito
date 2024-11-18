import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getSavingLimit } from '../../utils/database'
import EmojiHealthIndicator from '../emojis/EmojiHealthIndicator';
import savings from '../../app/(auth)/savings';

export default function SavingLimit({ userId, count, savings, setAddObjectiveLimit }) {
  const [savingLimit, setSavingLimit] = useState(0);

  useEffect(() => {
    const init = async () => {
      const dbLimit = await getSavingLimit(userId);
      console.log('SavingLimit:', dbLimit);
      setSavingLimit(dbLimit[0].min_amount);
      if (dbLimit[0].min_amount > 0) {
        setAddObjectiveLimit((prev) => ({ ...prev, limit: true }));
      };
    }
    init();
  }, [count]);


  return (
    <View>
      {savingLimit === 0 ? (
        <Text className='text-white text-xl text-center opacity-50'>
          Añade un límite de ahorro para controlar tus gastos
        </Text>
      ) : (
        <View>
          <Text className='text-[#ffffff99] text-lg font-semibold text-left'>${savingLimit}</Text>
          <View className='mx-auto mt-3'>
            <EmojiHealthIndicator currentAmount={savings} limitAmount={savingLimit} />
          </View>
        </View>
      )}
    </View>
  )
}