import { View, Text, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomInput from '../CustomInput';
import { getTotalSavings, updateTargetAmount } from '../../utils/database';

export default function UpdateSavingGoal({ userId, savingsId, currentTarget, closeModal, setCount }) {
  const [objective, setObjective] = useState(currentTarget.toString());
  const [totalSavings, setTotalSavings] = useState(0);

  // Obtener el total de ahorros
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

  // Manejar la validación y la actualización del objetivo
  const handleUpdateObjective = async () => {
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

    // Actualización si pasa las validaciones
    try {
      await updateTargetAmount(savingsId, parsedObjective);
      console.log('Objetivo actualizado correctamente');
      setCount((prev) => prev + 1);
      closeModal(false);
    } catch (error) {
      console.error('Error al actualizar objetivo:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el objetivo.');
    }
  };

  return (
    <View className='px-4'>
      <CustomInput
        value={objective}
        label='Nuevo objetivo de ahorro'
        placeholder='Actualizar objetivo de ahorro'
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
        onPress={handleUpdateObjective}
      >
        <Text className='text-center text-xl font-bold'>Actualizar</Text>
      </Pressable>
    </View>
  );
}
