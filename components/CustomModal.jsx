import { View, Text, Modal, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React from 'react'
import { CloseIcon } from './Icons'

export default function CustomModal({ children, isOpen, title, setIsOpen }) {
  return (
    <Modal
      animationType="slide"
      visible={isOpen}
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View className='bg-[#0000009b] h-full my-auto'>
          <View className='m-auto bg-[#2E2E33] h-[70%] w-[90%] p-2 rounded-xl'>
            <Pressable onPress={() => setIsOpen(false)} className='self-end top-2 right-2'>
              <CloseIcon />
            </Pressable>

            <Text className='text-white text-2xl font-bold text-center self-center bottom-3'>{title}</Text>

            {children}

          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}