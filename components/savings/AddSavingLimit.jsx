import { View, Text, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomInput from '../CustomInput';
import { insertSavingLimit, getTotalSavings } from '../../utils/database';

export default function AddSavingLimit({ userId, closeModal, setCount }) {
  const [limit, setLimit] = useState('');
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

  // Manejar la validación y la inserción del límite
  const handleInsertLimit = async () => {
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
      Alert.alert(
        'Error',
        `El límite debe ser menor que tus ahorros actuales (${totalSavings.toFixed(2)}).`
      );
      return;
    }

    // Inserción si pasa las validaciones
    try {
      await insertSavingLimit(userId, parsedLimit);
      console.log('Límite insertado correctamente');
      setCount((prev) => prev + 1);
      closeModal(false);
    } catch (error) {
      console.error('Error al insertar límite:', error);
      Alert.alert('Error', 'Hubo un problema al insertar el límite.');
    }
  };

  return (
    <View className="px-4">
      <CustomInput
        value={limit}
        label="Límite de ahorro"
        placeholder="Ingresar límite inferior de ahorro"
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
        onPress={handleInsertLimit}
      >
        <Text className="text-center text-xl font-bold">Guardar</Text>
      </Pressable>
    </View>
  );
}
