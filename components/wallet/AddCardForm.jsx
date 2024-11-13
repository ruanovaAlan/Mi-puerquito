import { View, Text, TextInput, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import SwitchButton from '../SwitchButton';
import CustomInput from '../CustomInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { insertAccount, getAccountsByUser } from '../../utils/database'

export default function AddCardForm({ userId, setCount, closeModal }) {
  const [selectedOption, setSelectedOption] = useState(1); //1: Crédito, 2: Débito
  const [date, setDate] = useState(new Date());
  const SwhitchOptions = { 1: 'credit', 2: 'debit', 3: 'savings' }

  const [card, setCard] = useState({
    user_id: userId,
    account_type: '',
    last_four: '',
    expiration_date: date.toISOString().split('T')[0],
    issuer: '',
    billing_date: '',
    balance_limit: null,
    balance: null
  })

  useEffect(() => {
    setCard((prev) => ({
      ...prev,
      account_type: SwhitchOptions[selectedOption]
    }));
  }, [selectedOption]);

  const handleChangeInput = (name, value) => {
    if (name === 'billing_date' && (parseInt(value, 10) > 31 || parseInt(value, 10) < 1) || value.includes('.')) {
      return;
    }
    setCard((prev) => ({ ...prev, [name]: value }));
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    currentDate.setHours(0, 0, 0, 0); // Establece la hora a medianoche
    setDate(currentDate); // Actualiza el estado con la fecha seleccionada
    const formattedDate = currentDate.toISOString().split('T')[0]; // Formatea la fecha a 'YYYY-MM-DD'
    setCard((prev) => ({ ...prev, expiration_date: formattedDate }))
  };

  const handleCreateWallet = async () => {
    try {
      console.log(await insertAccount(
        card.user_id,
        card.account_type,
        parseInt(card.last_four, 10),
        card.expiration_date.toString(),
        card.issuer,
        parseInt(card.billing_date, 10),
        parseFloat(card.balance_limit),
        parseFloat(card.balance)
      ));
      closeModal(false);
      setCount((prev) => prev + 1);

    } catch (error) {
      console.log('Error al crear tarjeta:', error);
    }

  }

  return (
    <View className='mt-4 px-2'>
      <SwitchButton optionOne='Crédito' optionTwo='Débito' optionThree='Efectivo'
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />

      {selectedOption !== 3 && (
        <>
          <View className='mt-6'>
            <Text className='text-white font-bold'>Banco</Text>
            <TextInput
              value={card.issuer}
              onChangeText={(text) => handleChangeInput('issuer', text)}
              placeholder="Nombre del banco"
              className='text-white bg-[#565661] rounded-lg p-2 mt-3'
            />
          </View>

          {selectedOption === 1 && (
            <CustomInput
              value={card.balance}
              label='Crédito Disponible'
              placeholder='Ingresa el crédito disponible'
              handleChange={(text) => handleChangeInput('balance', text)}
              type='numeric'
            />
          )}

          {selectedOption === 2 && (
            <CustomInput
              value={card.balance}
              label='Saldo Disponible'
              placeholder='Ingresa el saldo disponible'
              handleChange={(text) => handleChangeInput('balance', text)}
              type='numeric'
            />
          )
          }

          <CustomInput
            value={card.last_four}
            label='Últimos 4 dígitos'
            placeholder='Ingresa los últimos 4 dígitos'
            handleChange={(text) => handleChangeInput('last_four', text)}
            type='numeric'
            maxLength={4}
          />

          {selectedOption === 1 && (
            <CustomInput
              value={card.billing_date}
              label='Día de corte'
              placeholder='Ingresa el día de corte'
              handleChange={(text) => handleChangeInput('billing_date', text)}
              maxLength={2}
              type='numeric'
            />
          )
          }

          <View className='flex flex-col items-start mt-3'>
            <Text className='text-white font-bold mb-3'>Fecha de expiración</Text>
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          </View>
        </>
      )}


      <Pressable style={{
        backgroundColor: '#1EC968',
        width: '50%',
        padding: 10,
        borderRadius: 8,
        marginTop: 20,

        marginHorizontal: 'auto'
      }}
        onPress={handleCreateWallet}
      >
        <Text className='text-center text-xl font-bold'>Guardar</Text>
      </Pressable>

    </View >
  )
}