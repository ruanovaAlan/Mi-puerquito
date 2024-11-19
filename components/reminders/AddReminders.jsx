import { View, Text, Pressable, Alert, Platform } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../CustomInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { insertReminder } from '../../utils/database';

export default function AddReminder({ userId, closeModal, setCount }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInsertReminder = async () => {
    const parsedAmount = parseFloat(amount);

    if (!description.trim() || !amount.trim() || !reminderDate) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido y mayor a 0.');
      return;
    }

    // Validación de la fecha seleccionada
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo la fecha
    if (reminderDate < today) {
      Alert.alert('Error', 'La fecha seleccionada no puede ser en el pasado.');
      return;
    }

    try {
      const formattedDate = reminderDate.toISOString().split('T')[0];
      await insertReminder([userId, description, parsedAmount, formattedDate, 0]);
      console.log('Recordatorio insertado correctamente');
      setCount((prev) => prev + 1);
      closeModal(false);
    } catch (error) {
      console.error('Error al insertar recordatorio:', error);
      Alert.alert('Error', 'Hubo un problema al insertar el recordatorio.');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setReminderDate(selectedDate);
  };

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <CustomInput
        value={description}
        label="Descripción"
        placeholder="Ingrese la descripción del recordatorio"
        handleChange={(text) => setDescription(text)}
      />

      <CustomInput
        value={amount}
        label="Monto"
        placeholder="Ingrese el monto"
        handleChange={(text) => setAmount(text)}
        type="numeric"
      />

      {/* Campo de Fecha */}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 14, marginBottom: 8, marginTop: 12, fontWeight: 'bold' }}>
          Fecha del recordatorio
        </Text>
        <Pressable
          style={{
            padding: 12,
            backgroundColor: '#565661',
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#565661',
          }}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 14 }}>
            {reminderDate.toISOString().split('T')[0]}
          </Text>
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={reminderDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={handleDateChange}
            textColor="#FFFFFF"
            style={{
              marginTop: 8,
              backgroundColor: '#565661',
              borderRadius: 8,
            }}
          />
        )}
      </View>

      <Pressable
        style={{
          backgroundColor: '#1EC968',
          width: '100%',
          padding: 12,
          borderRadius: 8,
          marginTop: 10,
          alignSelf: 'center',
        }}
        onPress={handleInsertReminder}
      >
        <Text style={{ textAlign: 'center', color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
          Guardar
        </Text>
      </Pressable>
    </View>
  );
}
