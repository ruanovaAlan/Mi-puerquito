import { View, Text, Pressable } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import ScreenLayout from '../../components/ScreenLayout';
import { AddIcon } from '../../components/Icons';
import CreditCard from '../../components/wallet/CreditCard';
import HorizontalScroll from '../../components/HorizontalScroll';
import { AuthContext } from '../../context/AuthContext';
import { CardsContext } from '../../context/CardsContext';
import CustomModal from '../../components/CustomModal';
import AddCardForm from '../../components/wallet/AddCardForm';
import EditCardForm from '../../components/wallet/EditCardForm';
import { getAccountsByUser } from '../../utils/database';
import { colors } from '../../utils/colors';
import CreditHealth from '../../components/wallet/CreditHealth';

export default function Wallet() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { userId } = useContext(AuthContext);
  const { cards, setCards } = useContext(CardsContext);


  const fetchCards = async () => {
    try {
      const updatedCards = await getAccountsByUser(userId);
      setCards(updatedCards);
    } catch (error) {
      console.error('Error al obtener tarjetas:', error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
    setSelectedCard(null);
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    fetchCards();
  };

  const getModalHeight = () => {
    if (!selectedCard) return '80%'; // Altura fija para AddCardForm
    switch (selectedCard.account_type) {
      case 'savings':
        return '55%'; // Altura para efectivo
      case 'debit':
        return '73%'; // Altura para débito
      case 'credit':
        return '82%'; // Altura para crédito
      default:
        return '80%'; // Altura predeterminada
    }
  };


  return (
    <ScreenLayout>
      <View className="flex flex-row items-center gap-8 pt-4 mb-8">
        <Text className="text-white text-xl font-bold">Cuentas</Text>
        <Pressable onPress={handleOpenModal}>
          <View className="flex flex-row items-center">
            <AddIcon className="scale-90" />
            <Text className="text-[#60606C] text-lg font-bold ml-3">Agregar</Text>
          </View>
        </Pressable>
      </View>

      {cards.length > 0 ? (
        <HorizontalScroll heigth={145}>
          {cards.map((card, index) => (
            <CreditCard
              key={card.id}
              card={card}
              color={colors[index % colors.length]}
              onEdit={handleEditCard}
            />
          ))}
        </HorizontalScroll>
      ) : (
        <Text className="text-white text-lg text-center opacity-50">
          No tienes cuentas registradas
        </Text>
      )}

      <View className="mt-3">
        <CreditHealth user_id={userId} />
      </View>

      <CustomModal
        isOpen={modalOpen}
        title={selectedCard ? 'Editar cuenta' : 'Nueva cuenta'}
        setIsOpen={handleCloseModal}
        height={getModalHeight()}
      >
        {selectedCard ? (
          <EditCardForm card={selectedCard} closeModal={handleCloseModal} />
        ) : (
          <AddCardForm userId={userId} closeModal={handleCloseModal} />
        )}
      </CustomModal>
    </ScreenLayout>
  );
}
