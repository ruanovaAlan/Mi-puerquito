import { View, Text, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import ScreenLayout from '../../components/ScreenLayout'
import HorizontalScroll from '../../components/HorizontalScroll'
import CreditCard from '../../components/wallet/CreditCard'
import { AuthContext } from '../../context/AuthContext'
import { CardsContext } from '../../context/CardsContext'
import { colors } from '../../utils/colors'
import { getTotalSavings, deleteSavings } from '../../utils/database'
import { AddIcon } from '../../components/Icons'
import SavingGoal from '../../components/savings/SavingGoal'
import CustomModal from '../../components/CustomModal'
import AddSavingGoal from '../../components/savings/AddSavingGoal'
import AddSavingLimit from '../../components/savings/AddSavingLimit'
import SavingLimit from '../../components/savings/SavingLimit'


export default function savings() {
  const { userId } = useContext(AuthContext);
  const { cards } = useContext(CardsContext);
  const [savings, setSavings] = useState(0);
  const [objectiveModal, setObjectiveModal] = useState(false);
  const [limitModal, setLimitModal] = useState(false);
  const [addObjectiveLimit, setAddObjectiveLimit] = useState({
    objective: false,
    limit: false
  });
  const [count, setCount] = useState(0);


  const debitAndSavings = cards.filter(
    (account) => account.account_type === "debit" || account.account_type === "savings"
  );

  // Obtener el total de ahorros al cargar el componente y cuando `userId` cambie
  useEffect(() => {
    const fetchSavings = async () => {
      try {
        // await deleteSavings(); // Eliminar ahorros anteriores
        const data = await getTotalSavings(userId);
        if (data && data.length > 0) {
          setSavings(data[0].total_balance);
        } else {
          setSavings(0); // Si no hay datos, establecer en 0
        }
      } catch (error) {
        console.log("Error al obtener ahorros:", error);
      }
    };

    fetchSavings();
  }, [userId, cards]);

  const handleOpenModal = (type) => {
    if (type === 'limit') setLimitModal(true);
    else setObjectiveModal(true);
  }

  return (
    <ScreenLayout>
      <View className='flex flex-col  gap-8 pt-4 mb-6'>
        <View className='flex flex-row  items-center'>
          <Text className='text-white text-xl font-bold'>Efectivo/Tarjeta</Text>
          <View className='px-12'>
            <Text className='text-black text-xl font-extrabold bg-[#1EC96899] rounded-lg px-6 py-0'>${savings}</Text>
          </View>
        </View>
      </View>

      {debitAndSavings.length > 0 ? (
        <HorizontalScroll heigth={145}>
          {debitAndSavings.map((card, index) => (
            <CreditCard key={card.id} card={card} color={colors[index % colors.length]} />
          ))}
        </HorizontalScroll>
      )
        : (
          <Text className='text-white text-2xl font-bold text-center'>No tienes tarjetas registradas</Text>
        )
      }

      <View className='flex flex-row items-center justify-between pt-3 mb-3'>
        <Text className='text-white text-xl font-bold '>Objetivo de ahorro</Text>
        <Pressable
          onPress={() => handleOpenModal('')}
          disabled={addObjectiveLimit.objective}
        >
          <View className="flex flex-row items-center">
            <AddIcon className='scale-90' color={addObjectiveLimit.objective ? '#60606c7a' : '#60606C'} />
            <Text className="text-[#60606C] text-lg font-bold ml-3"
              style={{ color: addObjectiveLimit.objective ? '#60606c7a' : '#60606C' }}
            >
              Agregar
            </Text>
          </View>
        </Pressable>
      </View>

      <View className='mx-auto py-3'>
        <SavingGoal userId={userId} savings={savings} count={count} setAddObjectiveLimit={setAddObjectiveLimit} />
      </View>

      <CustomModal isOpen={objectiveModal} title='Nuevo objetivo' setIsOpen={setObjectiveModal} >
        <AddSavingGoal userId={userId} closeModal={setObjectiveModal} setCount={setCount} />
      </CustomModal>

      <View className='flex flex-row items-center justify-between pt-3 mb-1'>
        <Text className='text-white text-xl font-bold '>Límite de gastos</Text>
        <Pressable onPress={() => handleOpenModal('limit')}
          disabled={addObjectiveLimit.limit}
          tooltip='Agregar límite de gastos'
        >
          <View className="flex flex-row items-center">
            <AddIcon className='scale-90' color={addObjectiveLimit.limit ? '#60606c7a' : '#60606C'} />
            <Text className="text-[#60606C] text-lg font-bold ml-3"
              style={{ color: addObjectiveLimit.objective ? '#60606c7a' : '#60606C' }}
            >
              Agregar
            </Text>
          </View>
        </Pressable>
      </View>

      <View className='py-0'>
        <SavingLimit userId={userId} count={count} setAddObjectiveLimit={setAddObjectiveLimit} />
      </View>

      <CustomModal isOpen={limitModal} title='Nuevo límite' setIsOpen={setLimitModal} >
        <AddSavingLimit userId={userId} closeModal={setLimitModal} setCount={setCount} />
      </CustomModal>

    </ScreenLayout>
  )
}