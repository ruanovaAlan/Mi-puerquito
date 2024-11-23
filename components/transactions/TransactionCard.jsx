import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { categories, formatNumber } from '../../utils/helpers';
import { DotsIcon } from '../Icons';
import UpdateTransaction from './UpdateTransaction';
import CustomModal from '../CustomModal';

export default function TransactionCard({ transaction, type }) {
  const [modalVisible, setModalVisible] = useState(false); 
  const categoryKey = Object.keys(categories).find((key) => categories[key] === transaction.category);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const openEditModal = () => {
    setModalVisible(true);
  };

  const closeEditModal = () => {
    setModalVisible(false);
  };

  return (
    <View className='flex flex-row justify-between w-full my-2'>
      <View className='flex flex-row items-center w-[60%]'>
        <View className='w-14 h-14 rounded-full flex items-center justify-center bg-[#60606C]'>
          <Text className='text-3xl'>{transaction.category}</Text>
        </View>
        <View className='ml-2'>
          <Text className='text-white text-lg font-bold flex-wrap mb-1'>{truncateText(transaction.description, 13)}</Text>
          <Text className='text-[#60606C] text-base'>{categoryKey}</Text>
        </View>
      </View>

      <View className='flex flex-row items-center gap-5'>
        <Text
          className='text-white text-3xl font-bold'
          style={{ color: type === 'income' ? '#1EC968' : '#F00' }}
        >
          ${formatNumber(transaction.amount)}
        </Text>
        {/* Ícono de Dots con funcionalidad */}
        <Pressable onPress={openEditModal}>
          <DotsIcon />
        </Pressable>
      </View>

      {/* Modal para actualizar la transacción */}
      <CustomModal
        title="Editar Transacción"
        isOpen={modalVisible}
        setIsOpen={setModalVisible}
      >
        <UpdateTransaction
          transactionId={transaction.id}
          closeModal={closeEditModal}
        />
      </CustomModal>
    </View>
  );
}
