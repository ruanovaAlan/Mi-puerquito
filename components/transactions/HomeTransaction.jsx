import { View, Text } from 'react-native';
import React from 'react';
import { formatNumber } from '../../utils/helpers';

export default function HomeTransaction({ transaction }) {
  return (
    <View className="flex flex-row justify-between items-center w-full my-1 bg-[#303030] rounded-lg p-2">
      <View className="flex flex-row items-center">
        {/* Círculo con el ícono dinámico basado en transaction.category */}
        <View className="w-10 h-10 rounded-full flex items-center justify-center bg-[#60606C]">
          <Text className="text-xl">{transaction.category || '💰'}</Text>
        </View>
        <View className="ml-2">
          <Text className="text-white text-base font-bold">{transaction.description}</Text>
        </View>
      </View>
      <View>
        <Text
          className="text-lg font-bold"
          style={{ color: transaction.transaction_type === 'income' ? '#1EC968' : '#F00' }}
        >
          ${formatNumber(transaction.amount)}  
        </Text>
      </View>
    </View>
  );
}
