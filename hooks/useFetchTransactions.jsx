import { useState, useEffect } from 'react';
import { getTransactionsByUser, deleteTransactions } from '../utils/database'

export function useFetchTransactions(userId, count) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // await deleteTransactions();
        const data = await getTransactionsByUser(userId);
        setTransactions(data);

      } catch (error) {
        console.log("Error al obtener transactions:", error);
      }
    };

    fetchTransactions();
  }, [userId, count]); // `count` como dependencia

  // Retornar valores y funciones necesarias
  return { transactions };
}

