import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import CustomInput from '../CustomInput'
import CustomModal from '../CustomModal'
import CategoryPicker from '../../components/transactions/CategoryPicker'
import SwitchButton from '../SwitchButton'
import SelectWallet from './SelectWallet'
import { AuthContext } from '../../context/AuthContext'
import CustomDatePicker from '../CustomDatePicker'
import { insertTransaction } from '../../utils/database'


export default function AddTransaction({ setCount }) {
  const { userId } = useContext(AuthContext)
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(1)


  const [transaction, setTransaction] = useState({
    user_id: userId,
    wallet_id: 0,
    transaction_type: '',
    amount: 0,
    transaction_date: '',
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

  const handleInsertTransaction = async () => {
    try {
      const values = [
        transaction.user_id,
        transaction.wallet_id,
        transaction.transaction_type,
        transaction.amount,
        transaction.transaction_date,
        transaction.category,
        transaction.description,
      ];

      const result = await insertTransaction(values);
      console.log(result); // Confirmación de éxito
      setCount((prev) => prev + 1);
    } catch (error) {
      console.error('Error al insertar la transacción:', error);
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

          <View>
            <Text className='text-white font-bold mt-3'>Categoría</Text>
            <Pressable onPress={() => setCategoryModalVisible(true)}>
              <View className=' bg-[#565661] rounded-lg p-2 mt-3'>
                <Text className='text-white'>{transaction.category === '' ? 'Seleccionar categoría' : transaction.category}</Text>
              </View>
            </Pressable>
          </View>

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