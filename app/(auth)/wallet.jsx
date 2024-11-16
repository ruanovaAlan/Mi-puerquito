import { View, Text, Pressable } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import { AddIcon } from '../../components/Icons'
import CreditCard from '../../components/wallet/CreditCard'
import HorizontalScroll from '../../components/HorizontalScroll'
import { AuthContext } from '../../context/AuthContext'
import { CardsContext } from '../../context/CardsContext'
import CustomModal from '../../components/CustomModal'
import AddCardForm from '../../components/wallet/AddCardForm'
import { getAccountsByUser, deleteWalletsByUser } from '../../utils/database'
import { colors } from '../../utils/colors'



export default function Wallet() {
  const [modalOpen, setModalOpen] = useState(false)
  const { userId } = useContext(AuthContext);
  const { cards } = useContext(CardsContext);


  const handleOpenModal = () => {
    setModalOpen(true)
  }


  return (
    <ScreenLayout>
      <View className='flex flex-row items-center gap-8 pt-4 mb-6'>
        <Text className='text-white text-xl font-bold '>Cuentas</Text>
        <Pressable onPress={handleOpenModal}>
          <View className="flex flex-row items-center">
            <AddIcon className='scale-90' />
            <Text className="text-[#60606C] text-lg font-bold ml-3">Agregar</Text>
          </View>
        </Pressable>
      </View>

      {cards.length > 0 ? (
        <HorizontalScroll heigth={145}>
          {cards.map((card, index) => (
            <CreditCard key={card.id} card={card} color={colors[index % colors.length]} />
          ))}
        </HorizontalScroll>
      )
        : (
          <Text className='text-white text-2xl font-bold text-center'>No tienes tarjetas registradas</Text>
        )
      }

      <CustomModal isOpen={modalOpen} title='Nueva cuenta' setIsOpen={setModalOpen} >
        <AddCardForm userId={userId} closeModal={setModalOpen} />
      </CustomModal>

    </ScreenLayout >
  )
}