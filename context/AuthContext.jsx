// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Crear el contexto de autenticación
export const AuthContext = createContext();

// 2. Crear el proveedor del contexto de autenticación
export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('id_user');
      if (storedUserId) {
        setUserId(storedUserId);
      }
    };
    loadUserId();
  }, []);

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
}
