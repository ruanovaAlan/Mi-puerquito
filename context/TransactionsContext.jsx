import React, { createContext, useState } from 'react';

export const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transCount, setCount] = useState(0);

  const reloadTransaction = () => setCount((prevCount) => prevCount + 1);

  return (
    <TransactionsContext.Provider value={{ transCount, reloadTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
};
