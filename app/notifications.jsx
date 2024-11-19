import { View, Text, Pressable, Animated, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AddIcon } from '../components/Icons';
import CustomModal from '../components/CustomModal';
import AddReminder from '../components/reminders/AddReminders';
import { getRemindersByUser, updateReminderStatus } from '../utils/database';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function Notifications() {
  const { userId } = useContext(AuthContext);
  const [reminderModal, setReminderModal] = useState(false);
  const [count, setCount] = useState(0);
  const [reminders, setReminders] = useState([]);
  const animatedValues = useRef({}); // Animaciones individuales
  const [activeReminders, setActiveReminders] = useState({}); // Estado de los círculos seleccionados

  // Obtener los recordatorios desde la base de datos
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const data = await getRemindersByUser(userId);
        const sortedReminders = data.sort((a, b) => new Date(a.reminder_date) - new Date(b.reminder_date));
        setReminders(sortedReminders);

        // Inicializar animaciones
        const initialAnimations = {};
        sortedReminders.forEach((item) => {
          initialAnimations[item.id] = {
            translateY: new Animated.Value(0),
            opacity: new Animated.Value(1),
          };
        });
        animatedValues.current = initialAnimations;
      } catch (error) {
        console.error('Error al obtener los recordatorios:', error);
      }
    };

    fetchReminders();
  }, [count, userId]);

  // Manejar el cambio de estado del recordatorio
  const handleCompleteReminder = async (reminderId) => {
    try {
      // Agregar fondo verde y palomita al círculo
      setActiveReminders((prev) => ({ ...prev, [reminderId]: true }));

      // Esperar 3 segundos antes de la animación
      setTimeout(async () => {
        await updateReminderStatus(reminderId); // Cambiar el estado en la base de datos

        // Animar el desvanecimiento y desplazamiento hacia arriba
        Animated.parallel([
          Animated.timing(animatedValues.current[reminderId].translateY, {
            toValue: -50, // Mover hacia arriba
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues.current[reminderId].opacity, {
            toValue: 0, // Reducir opacidad
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Remover el recordatorio de la lista
          setReminders((prevReminders) =>
            prevReminders.filter((reminder) => reminder.id !== reminderId)
          );
        });
      }, 3000); // Retraso de 3 segundos
    } catch (error) {
      console.error('Error al completar el recordatorio:', error);
    }
  };

  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-[#18181B] pt-4 px-3">
        {/* Botón para abrir el modal de agregar recordatorio */}
        <Pressable
          className="flex flex-row items-center justify-end gap-8 pt-4 mb-6"
          onPress={() => setReminderModal(true)}
        >
          <View className="flex flex-row items-center">
            <AddIcon className="scale-90" />
            <Text className="text-[#60606C] text-lg font-bold ml-3">Agregar</Text>
          </View>
        </Pressable>

        {/* Lista de recordatorios */}
        <Animated.FlatList
          data={reminders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const { translateY, opacity } = animatedValues.current[item.id] || {};

            return (
              <Animated.View
                style={{
                  transform: [{ translateY }],
                  opacity,
                  borderColor: '#5C5C5C',
                  borderWidth: 1,
                  backgroundColor: '#3C3C43',
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {/* Círculo con estado */}
                <TouchableOpacity
                  onPress={() => handleCompleteReminder(item.id)}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: activeReminders[item.id] ? '#1EC968' : '#60606C',
                    backgroundColor: activeReminders[item.id] ? '#1EC968' : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 15,
                  }}
                >
                  {activeReminders[item.id] && (
                    <FontAwesome name="check" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>

                {/* Datos del recordatorio */}
                <View>
                  <Text className="text-white text-lg font-bold">{item.description}</Text>
                  <Text className="text-gray-400 text-sm">Monto: ${item.amount.toFixed(2)}</Text>
                  <Text className="text-gray-400 text-sm">Fecha: {item.reminder_date}</Text>
                </View>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
            <Text className="text-gray-500 text-center mt-6">No hay recordatorios disponibles</Text>
          }
        />

        {/* Modal para agregar recordatorio */}
        <CustomModal isOpen={reminderModal} title="Nuevo recordatorio" setIsOpen={setReminderModal}>
          <AddReminder userId={userId} closeModal={setReminderModal} setCount={setCount} />
        </CustomModal>
      </View>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
