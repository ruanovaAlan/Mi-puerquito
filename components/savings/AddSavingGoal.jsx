import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import CustomInput from '../CustomInput'
import { insertSavingGoal } from '../../utils/database'

export default function AddSavingGoal({ userId, closeModal }) {
  const [objective, setObjective] = useState(0);

  const handleInsertObjctive = async () => {
    try {
      await insertSavingGoal(userId, objective);
      console.log('Objetivo insertado correctamente');
      closeModal(false);
    } catch (error) {
      console.log('Error al insertar objetivo:', error);
    }
  }

  return (
    <View>
      <CustomInput
        value={objective}
        label='Objetivo de ahorro'
        placeholder='Ingresar objetivo de ahorro'
        handleChange={(text) => setObjective(text)}
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
        onPress={handleInsertObjctive}
      >
        <Text className='text-center text-xl font-bold'>Guardar</Text>
      </Pressable>
    </View>
  )
}