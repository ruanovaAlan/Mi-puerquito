import { View, Text, TextInput, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { useFetchCards } from '../../hooks/useFetchCards';
import SwitchButton from '../SwitchButton';
import CustomInput from '../CustomInput';

import { Picker } from '@react-native-picker/picker';

import { insertAccount, getAccountsByUser, autoInsertSavings } from '../../utils/database'
import { months, years } from '../../utils/expDateCards';

export default function AddCardForm({ userId, closeModal }) {
  const [selectedOption, setSelectedOption] = useState(1); //1: Crédito, 2: Débito
  const { setCount } = useFetchCards(userId);
  const [date, setDate] = useState(new Date());
  // const [expDate, setExpDate] = useState({ month: '', year: '' });
  const [dateShow, setDateShow] = useState({ month: false, year: false });
  const SwhitchOptions = { 1: 'credit', 2: 'debit', 3: 'savings' }

  const [card, setCard] = useState({
    user_id: userId,
    account_type: '',
    last_four: '',
    issuer: '',
    billing_date: '',
    balance_limit: '',
    available_balance: '',
    expMonth: '',
    expYear: ''
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

  // const handleDate = () => {
  //   const formattedDate = ;
  //   setCard((prev) => ({ ...prev, expiration_date: formattedDate }));
  // };


  const handleCreateWallet = async () => {
    try {

      console.log(await insertAccount(
        card.user_id,
        card.account_type,
        parseInt(card.last_four, 10),
        `${card.expMonth}/${card.expYear}`,
        card.issuer,
        parseInt(card.billing_date, 10),
        parseFloat(card.balance_limit),
        parseFloat(selectedOption === 1 ? card.balance_limit : card.available_balance)
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

      <ScrollView className='h-[70%] mt-5'>
        <View>
          <View className='mt-6'>
            <Text className='text-white font-bold'>{selectedOption === 3 ? 'Nombre' : 'Banco'}</Text>
            <TextInput
              value={card.issuer}
              onChangeText={(text) => handleChangeInput('issuer', text)}
              placeholder={selectedOption === 3 ? 'Ingresa el nombre' : 'Ingresa el banco'}
              className='text-white bg-[#565661] rounded-lg p-2 mt-3'
            />
          </View>

          {selectedOption !== 3 && (
            <>

              {selectedOption === 1 && (
                <CustomInput
                  value={card.balance_limit}
                  label='Crédito Disponible'
                  placeholder='Ingresa el límite de crédito'
                  handleChange={(text) => handleChangeInput('balance_limit', text)}
                  type='numeric'
                />
              )}

              {selectedOption === 2 && (
                <CustomInput
                  value={card.available_balance}
                  label='Saldo Disponible'
                  placeholder='Ingresa el saldo disponible'
                  handleChange={(text) => handleChangeInput('available_balance', text)}
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
                <Text className='text-white text-center mx-auto'>Seleccionar mes y año</Text>

                <View className='flex flex-row w-full'>
                  <View className='flex flex-col w-1/2'>
                    <Picker
                      selectedValue={card.expMonth}
                      onValueChange={(itemValue, itemIndex) =>
                        setCard((prev) => ({ ...prev, expMonth: itemValue }))
                      }
                      style={{ width: '100%', height: '50%', color: 'white' }}
                    >
                      {months.map((month) => (
                        <Picker.Item key={month.value} label={month.label} value={month.value} />
                      ))}
                    </Picker>
                  </View>

                  <View className='flex flex-col w-1/2'>
                    <Picker
                      selectedValue={card.expYear}
                      onValueChange={(itemValue, itemIndex) =>
                        setCard((prev) => ({ ...prev, expYear: itemValue }))
                      }
                      style={{ width: '100%', height: '50%', color: 'white' }}
                    >
                      {years.map((year) => (
                        <Picker.Item key={year.value} label={year.label} value={year.value} />
                      ))}
                    </Picker>
                  </View>
                </View>
              </View>
            </>
          )}

          {selectedOption === 3 && (
            <CustomInput
              value={card.available_balance}
              label='Efectivo Disponible'
              placeholder='Ingresa el efectivo disponible'
              handleChange={(text) => handleChangeInput('available_balance', text)}
              type='numeric'
            />
          )}
        </View>
      </ScrollView>
      <Pressable style={{
        backgroundColor: '#1EC968',
        width: '50%',
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 20,
        zIndex: 0,
        marginHorizontal: 'auto'
      }}
        onPress={handleCreateWallet}
      >
        <Text className='text-center text-xl font-bold'>Guardar</Text>
      </Pressable>

    </View >
  )
}