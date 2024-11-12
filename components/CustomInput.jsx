import { KeyboardAvoidingView, Platform, Text, TextInput } from 'react-native'

import React from 'react'

export default function CustomInput({ label, placeholder, handleChange, type, value, maxLength }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text className='text-white font-bold mt-3'>{label}</Text>
      <TextInput
        value={value}
        keyboardType={type}
        placeholder={placeholder}
        onChangeText={handleChange}
        maxLength={maxLength}
        className='text-white bg-[#565661] rounded-lg p-2 mt-3'
      />
    </KeyboardAvoidingView>
  )
}