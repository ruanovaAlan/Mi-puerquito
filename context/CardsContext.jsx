import React, { createContext, useState } from 'react';

// 1. Crear el contexto de autenticación
export const CardsContext = createContext();

// 2. Crear el proveedor del contexto de autenticación
export function CardsProvider({ children }) {
  const [cards, setCards] = useState([]);
  const [count, setCount] = useState(0);

  const updateCardBalance = (wallet_id, new_balance) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === wallet_id ? { ...card, available_balance: new_balance } : card
      )
    );
  };

  return (
    <CardsContext.Provider value={{ cards, setCards, count, setCount, updateCardBalance }}>
      {children}
    </CardsContext.Provider>
  );
}

