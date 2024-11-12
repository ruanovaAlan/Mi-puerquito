import { View, Text, Modal, Pressable } from 'react-native'
import React from 'react'
import { CloseIcon } from './Icons'

export default function CustomModal({ children, isOpen, title, setIsOpen }) {
  return (
    <Modal
      animationType="slide"
      visible={isOpen}
      transparent={true}
    >
      <View className='bg-[#0000009b] h-full my-auto'>
        <View className='m-auto bg-[#2E2E33] h-[70%] w-[90%] p-2 rounded-xl'>
          <Pressable onPress={() => setIsOpen(false)} className='self-end top-2 right-2'>
            <CloseIcon />
          </Pressable>

          <Text className='text-white text-xl font-bold text-center'>{title}</Text>

          {children}

        </View>
      </View>
    </Modal>
  )
}