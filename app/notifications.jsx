import { View, Text, Pressable, Animated, TouchableOpacity, Alert } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AddIcon, DeleteIcon, EditIcon } from '../components/Icons';
import CustomModal from '../components/CustomModal';
import AddReminder from '../components/reminders/AddReminders';
import { getRemindersByUser, updateReminderStatus, deleteReminderById, deleteReminders } from '../utils/database';
import { AuthContext } from '../context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function Notifications() {
  const { userId } = useContext(AuthContext);
  const [reminderModal, setReminderModal] = useState(false);
  const [editReminderModal, setEditReminderModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [count, setCount] = useState(0);
  const [reminders, setReminders] = useState([]);
  const animatedValues = useRef({});
  const [activeReminders, setActiveReminders] = useState({});

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        // await deleteReminders();
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


  const handleCompleteReminder = async (reminderId) => {
    try {
      setActiveReminders((prev) => ({ ...prev, [reminderId]: true }));

      setTimeout(async () => {
        await updateReminderStatus(reminderId);

        Animated.parallel([
          Animated.timing(animatedValues.current[reminderId].translateY, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValues.current[reminderId].opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setReminders((prevReminders) =>
            prevReminders.filter((reminder) => reminder.id !== reminderId)
          );
        });
      }, 500);
    } catch (error) {
      console.error('Error al completar el recordatorio:', error);
    }
  };

  const handleEditReminder = (reminderId) => {
    const reminderToEdit = reminders.find((reminder) => reminder.id === reminderId);
    setSelectedReminder(reminderToEdit);
    setEditReminderModal(true);
  };


  const handleDeleteReminder = async (reminderId) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar este recordatorio?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Eliminación cancelada'),
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            console.log(await deleteReminderById(reminderId));
            setCount((prev) => prev + 1);
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaProvider>

      <View className="flex-1 bg-[#18181B] pt-4 px-3">
        <Pressable
          className="flex flex-row items-center justify-end gap-8 pt-4 mb-6"
          onPress={() => setReminderModal(true)}
        >
          <View className="flex flex-row items-center">
            <AddIcon className="scale-90" />
            <Text className="text-[#60606C] text-lg font-bold ml-3">Agregar</Text>
          </View>
        </Pressable>

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
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 8,
                  marginBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >

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

                <View className='flex flex-row items-center w-full'>
                  <View className='w-[60%] px-0'>
                    <Text className="text-white text-lg font-bold">{item.description}</Text>
                    <View className='fle flex-row justify-between'>
                      <Text className="text-gray-400 text-sm font-medium opacity-90">${item.amount.toFixed(2)}</Text>
                      <Text
                        className="text-sm font-medium opacity-75"
                        style={{ color: new Date(item.reminder_date) < new Date() ? '#FF6B6B' : '#AAAAAA' }}>
                        {item.reminder_date}
                      </Text>
                    </View>
                  </View>
                  <View className='flex flex-row gap-4 w-[30%] px-4'>
                    <Pressable onPress={() => handleEditReminder(item.id)} className='scale-90'>
                      <EditIcon />
                    </Pressable>
                    <Pressable onPress={() => handleDeleteReminder(item.id)} className='scale-90'>
                      <DeleteIcon />
                    </Pressable>
                  </View>
                </View>
              </Animated.View>
            );
          }}
          ListEmptyComponent={
            <Text className="text-gray-500 text-center mt-6">No hay recordatorios disponibles</Text>
          }
        />

        <CustomModal isOpen={reminderModal} title="Nuevo recordatorio" setIsOpen={setReminderModal}>
          <AddReminder userId={userId} closeModal={setReminderModal} setCount={setCount} />
        </CustomModal>

        <CustomModal isOpen={editReminderModal} title="Editar recordatorio" setIsOpen={setEditReminderModal}>
          <AddReminder userId={userId} closeModal={setEditReminderModal} setCount={setCount} EditReminder={selectedReminder} />
        </CustomModal>
      </View>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
