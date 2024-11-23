import { View, Text } from 'react-native'
import React from 'react'
import { categories, formatNumber } from '../../utils/helpers'
import { DotsIcon } from '../Icons';



const TEST = { "amount": 5000, "category": "🍔", "description": "CervezaCervezaCervezaCervezaCerveza", "id": 1, "transaction_date": "2024-11-29", "transaction_type": "income", "user_id": 37, "wallet_id": 10 }

export default function transactionCard({ transaction, type }) {
  const categoryKey = Object.keys(categories).find(key => categories[key] === transaction.category);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <View className='flex flex-row justify-between w-full my-2'>
      <View className='flex flex-row items-center w-[60%]'>
        <View className='w-14 h-14 rounded-full flex items-center justify-center bg-[#60606C]'>
          <Text className='text-3xl'>{TEST.category}</Text>
        </View>
        <View className='ml-2'>
          <Text className='text-white text-lg font-bold flex-wrap mb-1'>{truncateText(transaction.description, 13)}</Text>
          <Text className='text-[#60606C] text-base'>{categoryKey}</Text>
        </View>
      </View>

      <View className='flex flex-row items-center gap-5'>
        <Text
          className='text-white text-3xl font-bold'
          style={{ color: type === 'income' ? '#1EC968' : '#F00' }} >
          ${formatNumber(transaction.amount)}
        </Text>
        <DotsIcon />
      </View>
    </View>
  )
}