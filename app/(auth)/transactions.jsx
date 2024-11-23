import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import { AddIcon } from '../../components/Icons'
import SwitchButton from '../../components/SwitchButton'
import ArrowsAmount from '../../components/transactions/ArrowsAmount'
import { formatNumber } from '../../utils/helpers'
import CustomModal from '../../components/CustomModal'
import AddTransaction from '../../components/transactions/AddTransaction'
import { AuthContext } from '../../context/AuthContext'
import ShowTransactions from '../../components/transactions/ShowTransactions'
import { useFetchTransactions } from '../../hooks/useFetchTransactions'
import { getTransactionSums } from '../../utils/database'


export default function Transactions() {
  const [selectedOption, setSelectedOption] = useState(1)
  const [formModalVisible, setFormModalVisible] = useState(false)
  const [count, setCount] = useState(0);
  const [transAmounts, setTransAmounts] = useState({ income: 0, expense: 0 });
  const { transactions } = useFetchTransactions(userId, count);

  const { userId } = useContext(AuthContext)

  useEffect(() => {
    const fetchTransactionSums = async () => {
      try {
        const data = await getTransactionSums(userId);
        setTransAmounts(data);

      } catch (error) {
        console.log("Error al obtener transacciones:", error);
      }
    };
    fetchTransactionSums();
    console.log(transAmounts)
  }, [userId, count, transactions]);

  const transactionType = selectedOption === 1 ? 'income' : 'expense'

  return (
    <ScreenLayout>
      <View className="flex flex-row items-center justify-between gap-8 pt-4 mb-6">
        <Text className="text-white text-xl font-bold">Movimientos</Text>
        <Pressable onPress={() => setFormModalVisible(true)}>
          <View className="flex flex-row items-center">
            <AddIcon className="scale-90" />
            <Text className="text-[#60606C] text-lg font-bold ml-3">Agregar</Text>
          </View>
        </Pressable>
      </View>
      <View className='border border-b-[#ffffff7f] mb-6' />

      <ArrowsAmount income={formatNumber(transAmounts.income)} expense={formatNumber(transAmounts.expense)} />

      <View className='w-[90%] mx-auto'>
        <SwitchButton optionOne='Ingresos' optionTwo='Egresos' selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </View>

      {transactions.length <= 0 ? (
        <ScrollView className='mt-6 py-4 mb-2'>
          <ShowTransactions userId={userId} type={transactionType} count={count} />
        </ScrollView>
      ) : (
        <Text className='text-white text-xl text-center mt-8'>No hay movimientos</Text>
      )}

      <CustomModal title='Escoge una categoría' isOpen={formModalVisible} setIsOpen={setFormModalVisible} >
        <AddTransaction setCount={setCount} closeModal={setFormModalVisible} />
      </CustomModal>

    </ScreenLayout>
  )
}