import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { crearTablaUsers, crearTablaCards, insertarUser, insertarCard } from './../utils/db.js';

const TestDB = () => {
  useEffect(() => {
    const pruebaDB = async () => {
      try {
        // Crear las tablas
        await crearTablaUsers();
        await crearTablaCards();

        // Insertar usuario de prueba
        await insertarUser('UsuarioPrueba');
        console.log('Usuario de prueba insertado');

        // Insertar tarjeta de prueba
        const userId = 1; // Ajusta según el ID de usuario
        await insertarCard(userId, 'Mi Tarjeta', 'credit', 1234, '12/25', 'Visa', 15, 5000, 1500);
        console.log('Tarjeta de prueba insertada');
      } catch (error) {
        console.log('Error en la prueba de base de datos:', error);
      }
    };

    pruebaDB();
  }, []);

  return (
    <View>
      <Text>Pruebas de base de datos completadas.</Text>
    </View>
  );
};

export default TestDB;
