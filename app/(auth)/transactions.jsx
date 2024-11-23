import { View, Text, Pressable } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import { AddIcon, UpIcon, DownIcon } from '../../components/Icons'
import SwitchButton from '../../components/SwitchButton'
import ArrowsAmount from '../../components/transactions/ArrowsAmount'
import { formatNumber } from '../../utils/helpers'
import CustomModal from '../../components/CustomModal'
import AddTransaction from '../../components/transactions/AddTransaction'
import { getTransactionsByUser } from '../../utils/database'
import { AuthContext } from '../../context/AuthContext'

export default function Transactions() {
  const [selectedOption, setSelectedOption] = useState(1)
  const [formModalVisible, setFormModalVisible] = useState(false)
  const [count, setCount] = useState(0);
  const { userId } = useContext(AuthContext)

  useEffect(() => {
    const fetchTransactions = async () => {
      const transactions = await getTransactionsByUser(userId)
      console.log(transactions)
    }
    fetchTransactions()
  }, [count, userId])

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

      <ArrowsAmount income={formatNumber(1000000)} expense={formatNumber(700000)} />

      <View className='w-[90%] mx-auto'>
        <SwitchButton optionOne='Ingresos' optionTwo='Egresos' selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </View>

      <CustomModal title='Escoge una categoría' isOpen={formModalVisible} setIsOpen={setFormModalVisible} >
        <AddTransaction setCount={setCount} />
      </CustomModal>

    </ScreenLayout>
  )
}