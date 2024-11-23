import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import CustomInput from '../CustomInput';
import CustomModal from '../CustomModal';
import CategoryPicker from '../../components/transactions/CategoryPicker';
import SwitchButton from '../SwitchButton';
import SelectWallet from './SelectWallet';
import CustomDatePicker from '../CustomDatePicker';
import { getTransactionById, updateTransaction, getAccountById, deleteTransactionById } from '../../utils/database';

export default function UpdateTransaction({ transactionId, closeModal}) {
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(1);

  const [transaction, setTransaction] = useState({
    user_id: 0,
    wallet_id: 0,
    transaction_type: '',
    amount: 0,
    transaction_date: '',
    category: '',
    description: ''
  });

  const SwhitchOptions = { 1: 'income', 2: 'expense' };

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const result = await getTransactionById(transactionId);
        if (result && result.length > 0) {
          const data = result[0];
          setTransaction({
            user_id: data.user_id,
            wallet_id: data.wallet_id,
            transaction_type: data.transaction_type,
            amount: data.amount.toString(),
            transaction_date: data.transaction_date,
            category: data.category,
            description: data.description
          });
          setSelectedOption(data.transaction_type === 'income' ? 1 : 2);
        }
      } catch (error) {
        console.error('Error al obtener la transacción:', error);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  useEffect(() => {
    setTransaction((prev) => ({
      ...prev,
      transaction_type: SwhitchOptions[selectedOption]
    }));
  }, [selectedOption]);

  const handleInputChange = (name, value) => {
    setTransaction((prevTrans) => ({
      ...prevTrans,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setTransaction((prevTrans) => ({
      ...prevTrans,
      transaction_date: date
    }));
  };

  const handleUpdateTransaction = async () => {
    try {
      // Validación de campos vacíos
      if (
        !transaction.wallet_id ||
        !transaction.transaction_type ||
        !transaction.amount ||
        !transaction.transaction_date ||
        !transaction.description ||
        (transaction.transaction_type === 'expense' && !transaction.category)
      ) {
        Alert.alert('Ups...', 'Todos los campos son obligatorios. Por favor, completa toda la información.');
        return;
      }

      const account = await getAccountById(transaction.wallet_id);

      if (!account || account.length === 0) {
        Alert.alert('Ups...', 'Cuenta no encontrada.');
        return;
      }

      const { available_balance, account_type, balance_limit } = account[0];

      // Validaciones amount
      if (transaction.transaction_type === 'expense' && parseFloat(transaction.amount) > available_balance) {
        Alert.alert('Ups...', `Cantidad no disponible en cuenta. Saldo disponible: $${available_balance.toFixed(2)}`);
        return;
      }

      if (
        transaction.transaction_type === 'income' &&
        account_type === 'credit' &&
        parseFloat(transaction.amount) > balance_limit - available_balance
      ) {
        const maxIncome = balance_limit - available_balance;
        Alert.alert(
          'Ups...',
          `El ingreso no puede superar el límite de crédito disponible. Máximo permitido: $${maxIncome.toFixed(2)}`
        );
        return;
      }

      // El monto debe ser mayor a 0
      if (parseFloat(transaction.amount) <= 0) {
        Alert.alert('Ups...', 'El monto debe ser mayor a 0.');
        return;
      }

      // Actualizar la transacción
      const updates = {
        wallet_id: transaction.wallet_id,
        transaction_type: transaction.transaction_type,
        amount: parseFloat(transaction.amount),
        transaction_date: transaction.transaction_date,
        category: transaction.category,
        description: transaction.description
      };

      const result = await updateTransaction(transactionId, updates);
      console.log(result);

      console.log('Éxito', 'La transacción se ha actualizado correctamente.');
      closeModal(false);
    } catch (error) {
      console.error('Error al actualizar la transacción:', error);
    }
  };

  return (
    <View className='mt-6 h-[60%]'>
      <SwitchButton optionOne='Ingresos' optionTwo='Egresos' selectedOption={selectedOption} setSelectedOption={setSelectedOption} />

      <View className=''>
        <ScrollView className='mt-6' keyboardShouldPersistTaps='handled'>
          <CustomInput
            label='Monto'
            placeholder='Ingresa el monto'
            value={transaction.amount}
            handleChange={(text) => handleInputChange('amount', text)}
            type='numeric'
          />

          <CustomInput
            label='Descripción'
            placeholder='Ingresa el detalle de la transacción'
            value={transaction.description}
            handleChange={(text) => handleInputChange('description', text)}
            maxLength={70}
          />

          {transaction.transaction_type === 'expense' && (
            <View>
              <Text className='text-white font-bold mt-3'>Categoría</Text>
              <Pressable onPress={() => setCategoryModalVisible(true)}>
                <View className=' bg-[#565661] rounded-lg p-2 mt-3'>
                  <Text className='text-white'>
                    {transaction.category === '' ? 'Seleccionar categoría' : transaction.category}
                  </Text>
                </View>
              </Pressable>
            </View>
          )}

          <SelectWallet setSelectedAccount={setTransaction} />

          <CustomDatePicker label='Fecha de la transacción' setDate={handleDateChange} />
        </ScrollView>
      </View>

      <Pressable
        style={{
          backgroundColor: '#1EC968',
          width: '100%',
          padding: 10,
          borderRadius: 8,
          marginTop: 20,
        }}
        onPress={handleUpdateTransaction}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Actualizar
        </Text>
      </Pressable>

      {/* Botón Eliminar */}
      <Pressable
        style={{
          backgroundColor: '#565661',
          width: '100%',
          padding: 10,
          borderRadius: 8,
          marginTop: 10,
          alignSelf: 'center',
        }}
        onPress={async () => {
          Alert.alert('Confirmar eliminación','¿Estás seguro de que deseas eliminar esta cuenta?', [
            {
              text: 'Cancelar',
              onPress: () => {},
              style: 'cancel',
            },
            {
              text: 'Eliminar',
              onPress: async () => {
                try {
                  await deleteTransactionById(transactionId);
                  closeModal(false);
                } catch (error) {
                  console.error('Error al eliminar la tarjeta:', error);
                }
              }
            },
          ]);
        }}

      >
        <Text style={{ textAlign: 'center', color: '#FF3D71', fontSize: 16, fontWeight: 'bold' }}>
          Eliminar
        </Text>
      </Pressable>

      <CustomModal
        title='Escoge una categoría'
        isOpen={categoryModalVisible}
        setIsOpen={setCategoryModalVisible}
      >
        <CategoryPicker selectedCategory={transaction.category} setSelectedCategory={handleInputChange} setModalOpen={setCategoryModalVisible} />
      </CustomModal>

      
    </View>
  );
}
