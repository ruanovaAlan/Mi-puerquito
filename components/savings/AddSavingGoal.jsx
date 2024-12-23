import { View, Text, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomInput from '../CustomInput';
import { insertSavingGoal, getTotalSavings } from '../../utils/database';

export default function AddSavingGoal({ userId, closeModal, setCount }) {
  const [objective, setObjective] = useState('');
  const [totalSavings, setTotalSavings] = useState(0);

  // Obtener el total de ahorros al cargar el componente
  useEffect(() => {
    const fetchTotalSavings = async () => {
      try {
        const savings = await getTotalSavings(userId);
        setTotalSavings(savings[0]?.total_balance || 0);
      } catch (error) {
        console.error('Error al obtener total de ahorros:', error);
      }
    };
    fetchTotalSavings();
  }, [userId]);

  // Manejar la validación y la inserción del objetivo
  const handleInsertObjective = async () => {
    const parsedObjective = parseFloat(objective);

    // Validaciones
    if (isNaN(parsedObjective)) {
      Alert.alert('Error', 'El objetivo debe ser un número válido.');
      return;
    }

    if (parsedObjective <= 0) {
      Alert.alert('Error', 'El objetivo debe ser mayor a 0.');
      return;
    }

    if (parsedObjective <= totalSavings) {
      Alert.alert('Error', `El objetivo debe ser mayor a tus ahorros actuales (${totalSavings.toFixed(2)}).`);
      return;
    }

    // Inserción si pasa las validaciones
    try {
      await insertSavingGoal(userId, parsedObjective);
      console.log('Objetivo insertado correctamente');
      setCount((prev) => prev + 1);
      closeModal(false);
    } catch (error) {
      console.error('Error al insertar objetivo:', error);
      Alert.alert('Error', 'Hubo un problema al insertar el objetivo.');
    }
  };

  return (
    <View className='px-4'>
      <CustomInput
        value={objective}
        label='Objetivo de ahorro'
        placeholder='Ingresar objetivo de ahorro'
        handleChange={(text) => setObjective(text)}
        type='numeric'
      />

      <Pressable
        style={{
          backgroundColor: '#1EC968',
          width: '50%',
          padding: 10,
          borderRadius: 8,
          marginTop: 20,
          marginBottom: 20,
          zIndex: 0,
          marginHorizontal: 'auto',
        }}
        onPress={handleInsertObjective}
      >
        <Text className='text-center text-xl font-bold'>Guardar</Text>
      </Pressable>
    </View>
  );
}
