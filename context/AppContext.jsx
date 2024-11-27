import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [walletReload, setWalletReload] = useState(0);
  const [transReload, setTransReload] = useState(0);

  const incrementCount = () => setCount((prevCount) => prevCount + 1);
  const reloadWallet = () => setWalletReload((prev) => prev + 1);
  const reloadTransactions = () => setTransReload((prev) => prev + 1);

  return (
    <AppContext.Provider value={{ count, incrementCount, walletReload, reloadWallet, transReload, reloadTransactions }}>
      {children}
    </AppContext.Provider>
  );
};
