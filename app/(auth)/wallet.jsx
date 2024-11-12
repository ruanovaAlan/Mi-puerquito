import { View, Text, Pressable } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import { AddIcon } from '../../components/Icons'
import CreditCard from '../../components/wallet/CreditCard'
import HorizontalScroll from '../../components/HorizontalScroll'
import { AuthContext } from '../../context/AuthContext'

import CustomModal from '../../components/CustomModal'
import AddCardForm from '../../components/wallet/AddCardForm'
import { obtenerCards } from '../../utils/db'
import { colors } from '../../utils/colors'

export default function Wallet() {
  const [modalOpen, setModalOpen] = useState(false)
  const [count, setCount] = useState(0)
  const { userId } = useContext(AuthContext);

  const [cards, setCards] = useState([]);

  console.log('userId:', userId);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await obtenerCards(userId)
        setCards(data)
        console.log('Cards:', data);

      } catch (error) {
        console.log("Error al obtener cards:", error);
      }
    };

    fetchCards();
  }, [count]);

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

      <HorizontalScroll heigth={145}>
        {cards.map((card, index) => (
          <CreditCard key={card.id} card={card} color={colors[index % colors.length]} />
        ))}
      </HorizontalScroll>



      <CustomModal isOpen={modalOpen} title='Nueva Tarjeta' setIsOpen={setModalOpen} >
        <AddCardForm userId={userId} closeModal={setModalOpen} setCount={setCount} />
      </CustomModal>

    </ScreenLayout >
  )
}