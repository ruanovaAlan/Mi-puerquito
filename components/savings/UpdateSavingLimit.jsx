import { View, Text, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomInput from '../CustomInput';
import { getTotalSavings, updateLimitAmount } from '../../utils/database';

export default function UpdateSavingLimit({ userId, savingsId, currentLimit, closeModal, setCount }) {
  const [limit, setLimit] = useState(currentLimit.toString());
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

  // Manejar la validación y la actualización del límite
  const handleUpdateLimit = async () => {
    const parsedLimit = parseFloat(limit);

    // Validaciones
    if (isNaN(parsedLimit)) {
      Alert.alert('Error', 'El límite debe ser un número válido.');
      return;
    }

    if (parsedLimit <= 0) {
      Alert.alert('Error', 'El límite debe ser mayor a 0.');
      return;
    }

    if (parsedLimit >= totalSavings) {
      Alert.alert('Error', `El límite debe ser menor que tus ahorros actuales (${totalSavings.toFixed(2)}).`);
      return;
    }

    // Actualización si pasa las validaciones
    try {
      await updateLimitAmount(savingsId, parsedLimit);
      console.log('Límite actualizado correctamente');
      setCount((prev) => prev + 1);
      closeModal(false);
    } catch (error) {
      console.error('Error al actualizar límite:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar el límite.');
    }
  };

  return (
    <View className="px-4">
      <CustomInput
        value={limit}
        label="Nuevo límite de ahorro"
        placeholder="Actualizar límite de ahorro"
        handleChange={(text) => setLimit(text)}
        type="numeric"
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
        onPress={handleUpdateLimit}
      >
        <Text className="text-center text-xl font-bold">Actualizar</Text>
      </Pressable>
    </View>
  );
}
