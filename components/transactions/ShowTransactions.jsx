import { View } from 'react-native';
import React from 'react';
import TransactionCard from '../transactions/TransactionCard';
import { useFetchTransactions } from '../../hooks/useFetchTransactions';

export default function ShowTransactions({ userId, type, count }) {
  const { transactions } = useFetchTransactions(userId, count);

  // Filtrar transacciones por tipo
  const filteredTransactions = transactions.filter(
    (transaction) => transaction.transaction_type === type
  );

  const cards = () => {
    return filteredTransactions.map((transaction) => (
      <TransactionCard key={transaction.id} transaction={transaction} type={type} />
    ));
  }

  return (
    <View className="w-full h-[40%] mx-auto px-1">
      {filteredTransactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} type={type} />
      ))}
    </View>
  );
}
