import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import CustomInput from '../CustomInput'
import { insertSavingLimit } from '../../utils/database'

export default function AddSavingLimit({ userId, closeModal, setCount }) {
  const [limit, setLimit] = useState(0);

  const handleInsertLimit = async () => {
    try {
      const response = await insertSavingLimit(userId, limit);
      console.log('Response:', response);
      setCount((prev) => prev + 1);
      closeModal(false);
    } catch (error) {
      console.log('Error al insertar límite:', error);
    }
  }

  return (
    <View className='px-4'>
      <CustomInput
        value={limit}
        label='Límite de ahorro'
        placeholder='Ingresar límite de ahorro'
        handleChange={(text) => setLimit(text)}
        type='numeric'
      />

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
        onPress={handleInsertLimit}
      >
        <Text className='text-center text-xl font-bold'>Guardar</Text>
      </Pressable>
    </View>
  )
}