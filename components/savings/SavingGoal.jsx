import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getSavingGoal, getObjectiveAndLimit } from '../../utils/database'

export default function SavingGoal({ userId, savings }) {
  const [savingGoal, setSavingGoal] = useState(0);

  useEffect(() => {
    const init = async () => {
      const dbGoal = await getSavingGoal(userId);
      console.log('SavingGoal:', dbGoal);
      setSavingGoal(dbGoal[0].target_amount);

    }
    init();
  }, []);

  const formatNumber = (value) => {
    if (value >= 1000 && value < 1000000) {
      return `${(value / 1000).toFixed(1)}k`; // 1000 -> 1k
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`; // 1000000 -> 1M
    }
    return value.toString(); // Si es menor a 1000, retorna el número sin cambios
  };


  return (
    <View>
      {savingGoal === 0 ? (
        <Text className='text-white text-xl text-center opacity-50'>
          Añade un objetivo de ahorro para conquistar tus objetivos
        </Text>
      ) : (

        <View className='flex flex-row items-center'>
          <Text className='text-[#1EC968] text-5xl font-semibold'>${formatNumber(savings)}</Text>
          <Text className='text-[#1EC968] text-7xl font-bold'> / </Text>
          <Text className='text-[#1EC968] text-5xl font-semibold'>${formatNumber(savingGoal)}</Text>
        </View>
      )
      }
    </View >
  )
}