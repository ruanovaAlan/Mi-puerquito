import { View, Text, Pressable, Platform } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CustomDatePicker({ label, setDate }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderDate, setReminderDate] = useState(new Date());

  const setToMidnight = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0); // Establece la hora a las 12:00 AM en la zona local
    return newDate;
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false); // Cerrar el selector si se cancela
      return;
    }

    if (selectedDate) {
      const finalDate = selectedDate ? setToMidnight(selectedDate) : setToMidnight(new Date());
      const formattedDate = finalDate.toISOString().split('T')[0];
      setReminderDate(finalDate); // Actualiza la fecha ajustada a medianoche
      setDate(formattedDate); // Actualiza el estado del componente padre

    }

    setShowDatePicker(false); // Cierra el selector después de la selección
  };

  const formatDisplayDate = () => {
    // Formatea la fecha en la zona local en formato yyyy-mm-dd
    if (reminderDate instanceof Date && !isNaN(reminderDate)) {
      const year = reminderDate.getFullYear();
      const month = String(reminderDate.getMonth() + 1).padStart(2, '0'); // Meses son base 0
      const day = String(reminderDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return 'Selecciona una fecha';
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: '#FFFFFF', fontSize: 14, marginBottom: 8, marginTop: 12, fontWeight: 'bold' }}>
        {label}
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
          {formatDisplayDate()}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={reminderDate || new Date()} // Usa una fecha válida por defecto
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
          style={{
            marginTop: 8,
            backgroundColor: '#565661',
            borderRadius: 8,
          }}
        />
      )}
    </View>
  );
}
