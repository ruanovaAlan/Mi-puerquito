import React, { createContext, useState } from 'react';

// 1. Crear el contexto de autenticación
export const RemindersContext = createContext();

// 2. Crear el proveedor del contexto de autenticación
export function RemindersProvider({ children }) {
  const [reminders, setReminders] = useState([]);
  const [count, setCount] = useState(0);

  return (
    <RemindersContext.Provider value={{ reminders, setReminders, count, setCount }}>
      {children}
    </RemindersContext.Provider>
  );
}
