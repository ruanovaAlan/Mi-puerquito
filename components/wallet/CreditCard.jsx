import { View, Text, Pressable } from 'react-native';
import React from 'react';

export default function CreditCard({ color, card, onEdit }) {
  const accoundOptions = { credit: 'Crédito', debit: 'Débito', savings: 'Efectivo' };

  return (
    <Pressable onPress={() => onEdit && onEdit(card)}>
      <View className="p-4 rounded-xl w-[200px] h-[130]"
        style={{
          backgroundColor: color,
          boxShadow: 'inset 0px 0px 6px 1px rgba(0, 0, 0, 0.7)',

        }}
      >
        <View className="flex flex-row justify-between mb-3">
          <Text className="text-black text-lg font-semibold">
            {accoundOptions[card.account_type]}
          </Text>
          <Text className="text-black text-lg font-semibold">{card.last_four}</Text>
        </View>
        <Text className="text-black text-xl font-extrabold">
          ${card.available_balance}
        </Text>
        <View className="flex flex-row justify-between items-center mt-3">
          <Text className="text-black text-md font-semibold">{card.issuer}</Text>
          <Text className="text-black text-md font-semibold">
            {card.account_type !== 'savings' ? card.expiration_date : ''}
          </Text>
        </View>
      </View>
    </Pressable >
  );
}
