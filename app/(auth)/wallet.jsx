import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import { AddIcon } from '../../components/Icons'
import CreditCard from '../../components/wallet/CreditCard'
import HorizontalScroll from '../../components/HorizontalScroll'
import CustomModal from '../../components/CustomModal'

export default function Wallet() {
  const [modalOpen, setModalOpen] = useState(false)

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  return (
    <ScreenLayout>

      <View className='flex flex-row items-center gap-8 pt-4 mb-6'>
        <Text className='text-white text-xl font-bold '>Tarjetas</Text>
        <Pressable onPress={handleOpenModal}>
          <View className="flex flex-row items-center">
            <AddIcon className='scale-90' />
            <Text className="text-[#60606C] text-lg font-bold ml-3">Agregar</Text>
          </View>
        </Pressable>
      </View>

      <HorizontalScroll>
        <CreditCard color='#74B3CE' />
        <CreditCard color='#A4B0F5' />
        <CreditCard color='#74B3CE' />
      </HorizontalScroll>

      <CustomModal isOpen={modalOpen} title='Nueva Tarjeta' setIsOpen={setModalOpen} />

    </ScreenLayout >
  )
}