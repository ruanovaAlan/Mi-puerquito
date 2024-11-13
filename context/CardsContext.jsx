import React, { createContext, useState } from 'react';

// 1. Crear el contexto de autenticación
export const CardsContext = createContext();

// 2. Crear el proveedor del contexto de autenticación
export function CardsProvider({ children }) {
  const [cards, setCards] = useState([]);
  const [count, setCount] = useState(0);

  return (
    <CardsContext.Provider value={{ cards, setCards, count, setCount }}>
      {children}
    </CardsContext.Provider>
  );
}
