import { View, Text, Pressable, ScrollView, Alert } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import CustomInput from '../CustomInput'
import CustomModal from '../CustomModal'
import CategoryPicker from '../../components/transactions/CategoryPicker'
import SwitchButton from '../SwitchButton'
import SelectWallet from './SelectWallet'
import { AuthContext } from '../../context/AuthContext'
import { CardsContext } from '../../context/CardsContext';
import { AppContext } from '../../context/AppContext'
import { TransactionsContext } from '../../context/TransactionsContext'
import CustomDatePicker from '../CustomDatePicker'
import { insertTransaction, applyTransactionToAccount, getAccountById } from '../../utils/database'


export default function AddTransaction({ closeModal }) {
  const { userId } = useContext(AuthContext)
  const { incrementCount, reloadWallet } = useContext(AppContext)
  const { reloadTransaction } = useContext(TransactionsContext)

  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(1)

  const formatDateToISO = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [transaction, setTransaction] = useState({
    user_id: userId,
    wallet_id: 0,
    transaction_type: '',
    amount: 0,
    transaction_date: formatDateToISO(),
    category: '',
    description: ''
  })

  const SwhitchOptions = { 1: 'income', 2: 'expense' };

  useEffect(() => {
    setTransaction((prev) => ({
      ...prev,
      transaction_type: SwhitchOptions[selectedOption],
    }));
  }, [selectedOption]);

  const handleInputChange = (name, value) => {
    setTransaction((prevTrans) => ({
      ...prevTrans,
      [name]: value
    })
    )
  }

  const handleDateChange = (date) => {
    setTransaction((prevTrans) => ({
      ...prevTrans,
      transaction_date: date
    }))
  }

  const { updateCardBalance } = useContext(CardsContext);

  const handleInsertTransaction = async () => {
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

      // Egreso no puede superar el balance disponible
      if (transaction.transaction_type === 'expense' && parseFloat(transaction.amount) > available_balance) {
        Alert.alert('Ups...', `Cantidad no disponible en cuenta. Saldo disponible: $${available_balance.toFixed(2)}`);
        return;
      }

      // Ingreso en tarjeta de crédito no puede superar el límite
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

      const newBalance = await applyTransactionToAccount(
        transaction.wallet_id,
        parseFloat(transaction.amount),
        transaction.transaction_type
      );

      updateCardBalance(transaction.wallet_id, newBalance);

      const values = [
        transaction.user_id,
        transaction.wallet_id,
        transaction.transaction_type,
        transaction.amount,
        transaction.transaction_date,
        transaction.transaction_type === 'expense' ? transaction.category : '💰',
        transaction.description,
      ];

      const result = await insertTransaction(values);
      incrementCount();
      reloadWallet();
      reloadTransaction();
      console.log(result); // Confirmación de éxito
      console.log(transaction.amount);
      console.log(transaction.transaction_date);
      closeModal(false);
    } catch (error) {
      console.error('Error al insertar la transacción:', error);
    }
  };


  return (
    <View className='mt-6 h-[60%]'>

      <SwitchButton optionOne='Ingresos' optionTwo='Egresos' selectedOption={selectedOption} setSelectedOption={setSelectedOption} isDisabled={false} />

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
        onPress={handleInsertTransaction}
      >
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          Guardar
        </Text>
      </Pressable>

      <CustomModal
        title='Escoge una categoría'
        isOpen={categoryModalVisible} setIsOpen={setCategoryModalVisible}
      >
        <CategoryPicker selectedCategory={transaction.category} setSelectedCategory={handleInputChange} setModalOpen={setCategoryModalVisible} />
      </CustomModal>


    </View>
  )
}