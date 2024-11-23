import { View, Text, Pressable, Alert, Platform, KeyboardAvoidingView, TextInput } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../CustomInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { insertReminder, updateReminder } from '../../utils/database';

export default function AddReminder({ userId, closeModal, setCount, EditReminder }) {
  const [reminder, setReminder] = useState({
    id: EditReminder ? EditReminder.id : null,
    description: EditReminder ? EditReminder.description : '',
    amount: EditReminder ? EditReminder.amount.toString() : '',
    status: EditReminder ? EditReminder.status : 0,
  });

  const [reminderDate, setReminderDate] = useState(
    EditReminder ? new Date(EditReminder.reminder_date) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);


  const setToMidnight = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // Establece la hora a las 12:00 AM
    return newDate;
  };

  const handleInsertReminder = async () => {
    const parsedAmount = parseFloat(reminder.amount);

    if (!handleValidations({ parsedAmount })) return;

    try {
      // Ajustar la fecha a las 12:00 AM
      const midnightDate = setToMidnight(reminderDate);
      const formattedDate = midnightDate.toISOString().split('T')[0];

      await insertReminder([userId, reminder.description, parsedAmount, formattedDate, 0]);

      console.log('Recordatorio insertado correctamente');
      setCount((prev) => prev + 1);
      closeModal(false);
    } catch (error) {
      console.error('Error al insertar recordatorio:', error);
      Alert.alert('Error', 'Hubo un problema al insertar el recordatorio.');
    }
  };

  const handleEditReminder = async () => {
    const parsedAmount = parseFloat(reminder.amount);

    if (!handleValidations({ parsedAmount })) return;

    try {
      // Ajustar la fecha a las 12:00 AM
      const midnightDate = setToMidnight(reminderDate);
      const formattedDate = midnightDate.toISOString().split('T')[0];

      const updatedReminder = {
        ...reminder,
        reminder_date: formattedDate,
      };

      const result = await updateReminder(updatedReminder, updatedReminder.id);
      console.log(result); // Confirmación de éxito
      setCount((prev) => prev + 1);
      closeModal(false);
    } catch (error) {
      console.error('Error al actualizar el recordatorio:', error);
      Alert.alert('Error', 'No se pudo actualizar el recordatorio.');
    }
  };


  const handleValidations = ({ parsedAmount }) => {
    if (!reminder.description.trim() || !reminder.amount.trim() || !reminderDate) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return false;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'El monto debe ser un número válido y mayor a 0.');
      return false;
    }

    // Validación de la fecha seleccionada
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Eliminar la hora para comparar solo la fecha
    if (reminderDate < today) {
      Alert.alert('Error', 'La fecha seleccionada no puede ser en el pasado.');
      return false;
    }

    return true;
  }


  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false); // Cerrar el selector si se cancela
      return;
    }

    if (selectedDate) {
      setReminderDate(selectedDate); // Actualiza la fecha ajustada a medianoche
    }
    setShowDatePicker(false); // Cierra el selector después de la selección
  };

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <CustomInput
        value={reminder.description}
        label="Descripción"
        placeholder="Ingrese la descripción del recordatorio"
        handleChange={(text) => setReminder((prev) => ({ ...prev, description: text }))}
      />

      <CustomInput
        value={reminder.amount}
        label="Monto"
        placeholder="Ingrese el monto"
        handleChange={(text) => setReminder((prev) => ({ ...prev, amount: text }))}
        type="decimal-pad"
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
        onPress={EditReminder ? handleEditReminder : handleInsertReminder}
      >
        <Text style={{ textAlign: 'center', color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' }}>
          {!EditReminder ? 'Guardar' : 'Editar'}
        </Text>
      </Pressable>
    </View>
  );
}
