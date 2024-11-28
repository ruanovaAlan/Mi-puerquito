import { View } from 'react-native';
import React, { useContext } from 'react';
import TransactionCard from '../transactions/TransactionCard';
import { useFetchTransactions } from '../../hooks/useFetchTransactions';
import { TransactionsContext } from '../../context/TransactionsContext';

export default function ShowTransactions({ userId, type }) {
  const { transCount } = useContext(TransactionsContext);
  const { transactions } = useFetchTransactions(userId, transCount);

  // Filtrar transacciones por tipo
  const filteredTransactions = transactions
    .filter((transaction) => transaction.transaction_type === type)
    .reverse();

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
