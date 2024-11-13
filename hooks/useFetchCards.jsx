import { useContext, useEffect } from 'react';
import { CardsContext } from '../context/CardsContext';
import { getAccountsByUser, deleteWalletsByUser } from '../utils/database';

export function useFetchCards(userId) {
  const { cards, setCards, count, setCount } = useContext(CardsContext);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // await deleteWalletsByUser(userId);
        const data = await getAccountsByUser(userId);
        setCards(data);
        console.log('Cards:', data);
      } catch (error) {
        console.log("Error al obtener cards:", error);
      }
    };

    fetchCards();
  }, [userId, count, setCards]); // `count` como dependencia

  // Retornar valores y funciones necesarias
  return { cards, setCount };
}
